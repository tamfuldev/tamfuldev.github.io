import datetime as dt
import math
import os
import re

import functions_framework
import pandas as pd


def _cors(payload, status=200):
    headers = {
        "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN", "*"),
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    return payload, status, headers


def _json_safe(value):
    if value is None:
        return None

    if isinstance(value, (dt.date, dt.datetime, pd.Timestamp)):
        return value.isoformat()

    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return None

    return value


def _records(frame):
    if frame is None or getattr(frame, "empty", True):
        return []

    cleaned = frame.where(pd.notnull(frame), None)

    return [
        {str(key): _json_safe(value) for key, value in row.items()}
        for row in cleaned.to_dict(orient="records")
    ]


def _first_record(frame):
    rows = _records(frame)

    return rows[0] if rows else {}


def _normalize_symbol(raw_symbol):
    symbol = re.sub(r"[^A-Za-z0-9]", "", raw_symbol or "").upper()

    if not symbol or len(symbol) > 12:
        raise ValueError("Invalid symbol.")

    return symbol


def _to_number(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None

    if math.isnan(number) or math.isinf(number):
        return None

    return number


def _pick(row, *keys):
    for key in keys:
        if key in row and row[key] is not None:
            return row[key]

    return None


def _normalize_prices(rows):
    bars = []

    for row in rows:
        close = _to_number(_pick(row, "close", "Close", "price", "match_price", "matchPrice"))

        if close is None:
            continue

        bars.append(
            {
                "close": close,
                "date": _pick(row, "time", "date", "tradingDate", "trading_date"),
                "high": _to_number(_pick(row, "high", "High")),
                "low": _to_number(_pick(row, "low", "Low")),
                "open": _to_number(_pick(row, "open", "Open")),
                "volume": _to_number(_pick(row, "volume", "Volume", "volume_accumulated", "totalVolume")),
            }
        )

    return bars


def _load_price_history(symbol):
    end = dt.date.today()
    start = end - dt.timedelta(days=420)

    try:
        from vnstock import Market

        market = Market()
        frame = market.equity.ohlcv(symbol=symbol, start=start.isoformat(), end=end.isoformat())
    except Exception:
        from vnstock import Quote

        source = os.environ.get("VNSTOCK_SOURCE", "KBS")
        quote = Quote(symbol=symbol, source=source)
        frame = quote.history(start=start.isoformat(), end=end.isoformat(), interval="1D")

    return _normalize_prices(_records(frame))


def _load_company_data(symbol):
    overview = {}
    events = []
    ratio = {}

    try:
        from vnstock import Company

        company = Company(symbol=symbol, source=os.environ.get("VNSTOCK_COMPANY_SOURCE", "VCI"))
        overview = _first_record(company.overview())

        try:
            events = _records(company.events())
        except Exception:
            events = []

        try:
            ratio = _first_record(company.ratio_summary())
        except Exception:
            ratio = {}
    except Exception:
        overview = {}
        events = []
        ratio = {}

    return overview, events, ratio


def _extract_dividends(events, ratio):
    dividends = []

    for event in events:
        title = str(_pick(event, "event_title", "title", "en__event_title") or "")
        event_type = str(_pick(event, "event_list_name", "en__event_list_name") or "")
        text = f"{title} {event_type}".lower()

        if "dividend" not in text and "co tuc" not in text and "cổ tức" not in text:
            continue

        amount = _to_number(_pick(event, "value", "cash", "cash_dividend", "cashDividend", "ratio"))
        event_date = _pick(event, "issue_date", "public_date", "date")

        if amount is None or not event_date:
            continue

        dividends.append(
            {
                "amount": amount,
                "date": event_date,
                "title": title or event_type,
            }
        )

    dividend_yield = _to_number(_pick(ratio, "dividend_yield", "dividendYield", "dividendRate"))

    return {
        "annualYield": dividend_yield,
        "events": dividends[:20],
    }


@functions_framework.http
def vnstock_analysis(request):
    if request.method == "OPTIONS":
        return _cors("", 204)

    try:
        api_key = os.environ.get("VNSTOCK_API_KEY")

        if not api_key:
            return _cors({"error": "VNSTOCK_API_KEY is not configured on the server."}, 500)

        from vnstock import register_user

        register_user(api_key=api_key)
        symbol = _normalize_symbol(request.args.get("symbol", "VNM"))
        prices = _load_price_history(symbol)
        overview, events, ratio = _load_company_data(symbol)

        if not prices:
            return _cors({"error": f"No VNStock price data for {symbol}."}, 404)

        name = (
            _pick(overview, "short_name", "shortName", "organ_name", "organName", "company_name", "symbol")
            or symbol
        )
        exchange = _pick(overview, "exchange", "floor", "market") or "-"
        dividend = _extract_dividends(events, ratio)

        return _cors(
            {
                "currency": "VND",
                "dataSource": "VNStock API",
                "dividend": dividend,
                "exchange": exchange,
                "name": name,
                "prices": prices,
                "ratio": ratio,
                "symbol": symbol,
            }
        )
    except Exception as error:
        return _cors({"error": str(error)}, 500)
