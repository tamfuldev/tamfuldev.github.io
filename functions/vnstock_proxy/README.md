# VNStock proxy

React must not call VNStock with the API key directly because frontend environment variables are public after build. Deploy this small Python HTTP function and store the key on the server.

## Local run

```bash
cd functions/vnstock_proxy
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set VNSTOCK_API_KEY=vnstock_xxx
functions-framework --target vnstock_analysis --port 8083
```

Then set the React app endpoint:

```bash
REACT_APP_VNSTOCK_PROXY_URL=http://localhost:8083
```

## Production

Set `VNSTOCK_API_KEY` as a secret/environment variable in the platform where this function is deployed, then set `REACT_APP_VNSTOCK_PROXY_URL` to the deployed HTTPS URL.
