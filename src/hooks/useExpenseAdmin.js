import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { firestore } from "../configs/firebase";

export const EXPENSE_MONTHS = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, "0")
);

export const DEFAULT_EXPENSE_CATEGORIES = [
    { id: "food", name: "Ăn uống", icon: "🍜", color: "#A855F7", budgetMonthly: 4500000, order: 1 },
    { id: "transport", name: "Di chuyển", icon: "🚗", color: "#EC4899", budgetMonthly: 1200000, order: 2 },
    { id: "shopping", name: "Mua sắm", icon: "🛍️", color: "#F97316", budgetMonthly: 3000000, order: 3 },
    { id: "health", name: "Sức khỏe", icon: "💊", color: "#22C55E", budgetMonthly: 1500000, order: 4 },
    { id: "games", name: "Giải trí", icon: "🎮", color: "#38BDF8", budgetMonthly: 1000000, order: 5 },
    { id: "learning", name: "Học tập", icon: "📚", color: "#FACC15", budgetMonthly: 2000000, order: 6 },
    { id: "home", name: "Nhà ở", icon: "🏠", color: "#FB7185", budgetMonthly: 6000000, order: 7 },
    { id: "saving", name: "Tiết kiệm", icon: "💰", color: "#14B8A6", budgetMonthly: 0, order: 8 },
    { id: "other", name: "Khác", icon: "🔧", color: "#94A3B8", budgetMonthly: 1000000, order: 9 },
];

const emptyMonthly = () =>
    EXPENSE_MONTHS.reduce((months, month) => ({
        ...months,
        [month]: {
            byCategory: {},
            expense: 0,
            income: 0,
        },
    }), {});

export const emptyExpenseSummary = {
    byCategory: {},
    monthly: emptyMonthly(),
    totalExpense: 0,
    totalIncome: 0,
    transactionCount: 0,
};

export const toExpenseDate = (value) => {
    if (!value) {
        return new Date();
    }

    if (typeof value.toDate === "function") {
        return value.toDate();
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const toDateInputValue = (value = new Date()) => {
    const date = toExpenseDate(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const formatVnd = (value) => new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
}).format(Number(value || 0));

export const parseMoneyInput = (value) => String(value || "").replace(/\D/g, "");

export const formatMoneyInput = (value) => {
    const numberValue = Number(parseMoneyInput(value));

    return numberValue ? new Intl.NumberFormat("vi-VN").format(numberValue) : "";
};

export const getExpenseYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;

    return Array.from({ length: currentYear - startYear + 2 }, (_, index) =>
        String(startYear + index)
    ).reverse();
};

export const getUserExpenseRoot = (uid) => firestore.collection("users").doc(uid);

export const getTransactionsRef = (uid, year) =>
    getUserExpenseRoot(uid).collection("expenses").doc(String(year)).collection("transactions");

export const getSummaryRef = (uid, year) =>
    getUserExpenseRoot(uid).collection("expenses").doc(String(year)).collection("summary").doc("current");

export const getCategoriesRef = (uid) => getUserExpenseRoot(uid).collection("categories");

export const ensureDefaultCategories = async (uid) => {
    if (!uid) {
        return;
    }

    const categoriesRef = getCategoriesRef(uid);
    const snapshot = await categoriesRef.limit(1).get();

    if (!snapshot.empty) {
        return;
    }

    const batch = firestore.batch();
    const now = firebase.firestore.FieldValue.serverTimestamp();

    DEFAULT_EXPENSE_CATEGORIES.forEach((category) => {
        batch.set(categoriesRef.doc(category.id), {
            ...category,
            createdAt: now,
            updatedAt: now,
        });
    });

    await batch.commit();
};

export const rebuildYearSummary = async (uid, year) => {
    const transactionsSnapshot = await getTransactionsRef(uid, year).get();
    const summary = {
        byCategory: {},
        monthly: emptyMonthly(),
        totalExpense: 0,
        totalIncome: 0,
        transactionCount: transactionsSnapshot.size,
    };

    transactionsSnapshot.forEach((doc) => {
        const transaction = doc.data();
        const amount = Number(transaction.amount || 0);
        const date = toExpenseDate(transaction.date);
        const month = String(date.getMonth() + 1).padStart(2, "0");

        if (transaction.type === "income") {
            summary.totalIncome += amount;
            summary.monthly[month].income += amount;
            return;
        }

        const categoryId = transaction.categoryId || "other";

        summary.totalExpense += amount;
        summary.byCategory[categoryId] = (summary.byCategory[categoryId] || 0) + amount;
        summary.monthly[month].expense += amount;
        summary.monthly[month].byCategory[categoryId] =
            (summary.monthly[month].byCategory[categoryId] || 0) + amount;
    });

    const now = firebase.firestore.FieldValue.serverTimestamp();

    await getUserExpenseRoot(uid).collection("expenses").doc(String(year)).set(
        {
            updatedAt: now,
            year: String(year),
        },
        { merge: true }
    );

    await getSummaryRef(uid, year).set(
        {
            ...summary,
            rebuiltAt: now,
        },
        { merge: true }
    );

    return summary;
};

const buildDateRange = (year, month) => {
    const yearNumber = Number(year);

    if (month && month !== "all") {
        const monthNumber = Number(month) - 1;

        return {
            end: new Date(yearNumber, monthNumber + 1, 1),
            start: new Date(yearNumber, monthNumber, 1),
        };
    }

    return {
        end: new Date(yearNumber + 1, 0, 1),
        start: new Date(yearNumber, 0, 1),
    };
};

export const useCategories = (uid) => {
    const [categories, setCategories] = React.useState([]);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!uid) {
            setCategories([]);
            setLoading(false);
            return undefined;
        }

        let cancelled = false;
        setLoading(true);

        ensureDefaultCategories(uid).catch((seedError) => {
            if (!cancelled) {
                setError(seedError.message);
                setLoading(false);
            }
        });

        const unsubscribe = getCategoriesRef(uid).orderBy("order", "asc").onSnapshot(
            (snapshot) => {
                setCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setError("");
                setLoading(false);
            },
            (snapshotError) => {
                setError(snapshotError.message);
                setLoading(false);
            }
        );

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, [uid]);

    return { categories, error, loading };
};

export const useSummary = (uid, year) => {
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [summary, setSummary] = React.useState(emptyExpenseSummary);

    React.useEffect(() => {
        if (!uid || !year) {
            setSummary(emptyExpenseSummary);
            setLoading(false);
            return undefined;
        }

        setLoading(true);

        const unsubscribe = getSummaryRef(uid, year).onSnapshot(
            (doc) => {
                setSummary(doc.exists ? {
                    ...emptyExpenseSummary,
                    ...doc.data(),
                    monthly: {
                        ...emptyMonthly(),
                        ...(doc.data().monthly || {}),
                    },
                } : emptyExpenseSummary);
                setError("");
                setLoading(false);
            },
            (snapshotError) => {
                setError(snapshotError.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [uid, year]);

    return { error, loading, summary };
};

export const useTransactions = (uid, year, month = "all") => {
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [transactions, setTransactions] = React.useState([]);

    React.useEffect(() => {
        if (!uid || !year) {
            setTransactions([]);
            setLoading(false);
            return undefined;
        }

        const { start, end } = buildDateRange(year, month);
        setLoading(true);

        const unsubscribe = getTransactionsRef(uid, year)
            .where("date", ">=", start)
            .where("date", "<", end)
            .orderBy("date", "desc")
            .onSnapshot(
                (snapshot) => {
                    setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                    setError("");
                    setLoading(false);
                },
                (snapshotError) => {
                    setError(snapshotError.message);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [uid, year, month]);

    return { error, loading, transactions };
};

export const useBudget = ({ categories, month, summary }) => React.useMemo(() => {
    const monthSummary = summary.monthly?.[month] || { byCategory: {} };

    return categories.map((category) => {
        const spent = Number(monthSummary.byCategory?.[category.id] || 0);
        const budget = Number(category.budgetMonthly || 0);
        const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
        const status = percent >= 100 ? "danger" : percent >= 70 ? "warning" : "safe";

        return {
            ...category,
            budget,
            percent,
            spent,
            status,
        };
    });
}, [categories, month, summary]);

export const addExpenseTransaction = async (uid, year, payload) => {
    const now = firebase.firestore.FieldValue.serverTimestamp();

    await getTransactionsRef(uid, year).add({
        ...payload,
        amount: Number(payload.amount || 0),
        createdAt: now,
        updatedAt: now,
    });

    await rebuildYearSummary(uid, year);
};

export const updateExpenseTransaction = async (uid, year, transactionId, payload) => {
    await getTransactionsRef(uid, year).doc(transactionId).update({
        ...payload,
        amount: Number(payload.amount || 0),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await rebuildYearSummary(uid, year);
};

export const deleteExpenseTransaction = async (uid, year, transactionId) => {
    await getTransactionsRef(uid, year).doc(transactionId).delete();
    await rebuildYearSummary(uid, year);
};

export const saveExpenseCategory = async (uid, category) => {
    const categoriesRef = getCategoriesRef(uid);
    const id = category.id || categoriesRef.doc().id;
    const now = firebase.firestore.FieldValue.serverTimestamp();

    await categoriesRef.doc(id).set(
        {
            budgetMonthly: Number(category.budgetMonthly || 0),
            color: category.color || "#A855F7",
            icon: category.icon || "🔧",
            name: category.name?.trim() || "Khac",
            order: Number(category.order || Date.now()),
            updatedAt: now,
            ...(!category.id ? { createdAt: now } : {}),
        },
        { merge: true }
    );

    return id;
};

export const categoryHasTransactions = async (uid, categoryId, years) => {
    const checks = await Promise.all(
        years.map((year) =>
            getTransactionsRef(uid, year)
                .where("categoryId", "==", categoryId)
                .limit(1)
                .get()
        )
    );

    return checks.some((snapshot) => !snapshot.empty);
};

export const deleteExpenseCategory = async (uid, categoryId) => {
    await getCategoriesRef(uid).doc(categoryId).delete();
};

export const getYearTransactions = async (uid, year) => {
    const { start, end } = buildDateRange(year, "all");
    const snapshot = await getTransactionsRef(uid, year)
        .where("date", ">=", start)
        .where("date", "<", end)
        .orderBy("date", "desc")
        .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
