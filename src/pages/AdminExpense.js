import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    FiAlertTriangle,
    FiBarChart2,
    FiCreditCard,
    FiDollarSign,
    FiDownload,
    FiEdit2,
    FiGrid,
    FiPieChart,
    FiPlus,
    FiRefreshCw,
    FiSave,
    FiSearch,
    FiSettings,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase";
import {
    addExpenseTransaction,
    categoryHasTransactions,
    DEFAULT_EXPENSE_CATEGORIES,
    deleteExpenseCategory,
    deleteExpenseTransaction,
    EXPENSE_MONTHS,
    formatMoneyInput,
    formatVnd,
    getExpenseYearOptions,
    getYearTransactions,
    parseMoneyInput,
    rebuildYearSummary,
    saveExpenseCategory,
    toDateInputValue,
    updateExpenseTransaction,
    useBudget,
    useCategories,
    useSummary,
    useTransactions,
} from "../hooks/useExpenseAdmin";
import AdminShell from "../components/admin/AdminShell";
import "../styles/admin.css";

const currentDate = new Date();
const currentYear = String(currentDate.getFullYear());
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

const monthLabels = {
    "01": "Tháng 1",
    "02": "Tháng 2",
    "03": "Tháng 3",
    "04": "Tháng 4",
    "05": "Tháng 5",
    "06": "Tháng 6",
    "07": "Tháng 7",
    "08": "Tháng 8",
    "09": "Tháng 9",
    "10": "Tháng 10",
    "11": "Tháng 11",
    "12": "Tháng 12",
};

const sidebarItems = [
    { id: "dashboard", icon: FiPieChart, label: "Dashboard" },
    { id: "transactions", icon: FiCreditCard, label: "Giao dịch" },
    { id: "categories", icon: FiGrid, label: "Danh mục" },
    { id: "budget", icon: FiDollarSign, label: "Ngân sách" },
    { id: "reports", icon: FiBarChart2, label: "Báo cáo" },
    { id: "settings", icon: FiSettings, label: "Cài đặt" },
];

const emptyTransactionForm = {
    amount: "",
    categoryId: "food",
    date: `${currentYear}-${currentMonth}-${String(currentDate.getDate()).padStart(2, "0")}`,
    note: "",
    type: "expense",
};

const emptyCategoryForm = {
    budgetMonthly: "",
    color: "#A855F7",
    icon: "🔧",
    id: "",
    name: "",
};

const getCategoryName = (categoryMap, categoryId) => categoryMap[categoryId]?.name || "Khác";

const buildCategoryMap = (categories) =>
    categories.reduce((map, category) => ({
        ...map,
        [category.id]: category,
    }), {});

const toCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const normalizeDateForSubmit = (dateKey) => new Date(`${dateKey}T12:00:00`);

const ExpenseSkeleton = () => (
    <div className="expense-admin-skeleton">
        <span />
        <span />
        <span />
        <span />
    </div>
);

const AdminExpense = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const uid = user?.uid;
    const yearOptions = React.useMemo(() => getExpenseYearOptions(), []);

    const [activeSection, setActiveSection] = React.useState("dashboard");
    const [budgetDrafts, setBudgetDrafts] = React.useState({});
    const [categoryForm, setCategoryForm] = React.useState(emptyCategoryForm);
    const [editingCategoryId, setEditingCategoryId] = React.useState("");
    const [editingTransactionId, setEditingTransactionId] = React.useState("");
    const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
    const [selectedYear, setSelectedYear] = React.useState(currentYear);
    const [toast, setToast] = React.useState(null);
    const [transactionFilters, setTransactionFilters] = React.useState({
        categoryId: "all",
        month: currentMonth,
        search: "",
        type: "all",
    });
    const [transactionForm, setTransactionForm] = React.useState(emptyTransactionForm);
    const [visibleCount, setVisibleCount] = React.useState(10);

    const { categories, error: categoryError, loading: categoriesLoading } = useCategories(uid);
    const { error: summaryError, loading: summaryLoading, summary } = useSummary(uid, selectedYear);
    const { summary: previousSummary } = useSummary(uid, String(Number(selectedYear) - 1));
    const {
        error: transactionError,
        loading: transactionsLoading,
        transactions,
    } = useTransactions(uid, selectedYear, transactionFilters.month);
    const budgetRows = useBudget({ categories, month: selectedMonth, summary });
    const categoryMap = React.useMemo(() => buildCategoryMap(categories), [categories]);
    const overBudgetCount = budgetRows.filter((item) => item.budget > 0 && item.percent >= 100).length;

    React.useEffect(() => {
        setBudgetDrafts(
            categories.reduce((drafts, category) => ({
                ...drafts,
                [category.id]: String(category.budgetMonthly || ""),
            }), {})
        );
    }, [categories]);

    React.useEffect(() => {
        setVisibleCount(10);
    }, [selectedYear, transactionFilters.categoryId, transactionFilters.month, transactionFilters.search, transactionFilters.type]);

    React.useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timer = window.setTimeout(() => setToast(null), 2600);

        return () => window.clearTimeout(timer);
    }, [toast]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const updateTransactionFilter = (field, value) => {
        setTransactionFilters((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const dashboardMonthSummary = summary.monthly?.[selectedMonth] || { byCategory: {}, expense: 0, income: 0 };
    const balance = summary.totalIncome - summary.totalExpense;
    const savingsAmount = Math.max(balance, 0);
    const monthlyBarData = EXPENSE_MONTHS.map((month) => ({
        expense: summary.monthly?.[month]?.expense || 0,
        income: summary.monthly?.[month]?.income || 0,
        month: month.replace(/^0/, "T"),
    }));
    const donutData = categories
        .map((category) => ({
            color: category.color || "#A855F7",
            name: category.name,
            value: dashboardMonthSummary.byCategory?.[category.id] || 0,
        }))
        .filter((item) => item.value > 0);
    const topCategories = Object.entries(summary.byCategory || {})
        .map(([categoryId, amount]) => ({
            amount,
            category: categoryMap[categoryId] || { color: "#94A3B8", icon: "🔧", name: "Khác" },
            categoryId,
        }))
        .sort((first, second) => second.amount - first.amount)
        .slice(0, 5);
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesType = transactionFilters.type === "all" || transaction.type === transactionFilters.type;
        const matchesCategory =
            transactionFilters.categoryId === "all" || transaction.categoryId === transactionFilters.categoryId;
        const matchesSearch =
            !transactionFilters.search ||
            String(transaction.note || "").toLowerCase().includes(transactionFilters.search.toLowerCase());

        return matchesType && matchesCategory && matchesSearch;
    });
    const visibleTransactions = filteredTransactions.slice(0, visibleCount);
    const mostExpensiveMonth = monthlyBarData.reduce((top, item) => (item.expense > top.expense ? item : top), monthlyBarData[0]);
    const leastExpensiveMonth = monthlyBarData.reduce((low, item) => {
        if (item.expense === 0) {
            return low;
        }

        return low.expense === 0 || item.expense < low.expense ? item : low;
    }, monthlyBarData[0]);

    const openTransactionModal = (transaction = null) => {
        if (transaction) {
            setEditingTransactionId(transaction.id);
            setTransactionForm({
                amount: String(transaction.amount || ""),
                categoryId: transaction.categoryId || categories[0]?.id || "food",
                date: toDateInputValue(transaction.date),
                note: transaction.note || "",
                type: transaction.type || "expense",
            });
        } else {
            setEditingTransactionId("");
            setTransactionForm({
                ...emptyTransactionForm,
                categoryId: categories[0]?.id || "food",
                date: `${selectedYear}-${selectedMonth}-01`,
            });
        }

        setIsTransactionModalOpen(true);
    };

    const closeTransactionModal = () => {
        setEditingTransactionId("");
        setIsTransactionModalOpen(false);
        setTransactionForm(emptyTransactionForm);
    };

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategoryId(category.id);
            setCategoryForm({
                budgetMonthly: String(category.budgetMonthly || ""),
                color: category.color || "#A855F7",
                icon: category.icon || "🔧",
                id: category.id,
                name: category.name || "",
            });
        } else {
            setEditingCategoryId("");
            setCategoryForm(emptyCategoryForm);
        }

        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setEditingCategoryId("");
        setIsCategoryModalOpen(false);
        setCategoryForm(emptyCategoryForm);
    };

    const handleTransactionSubmit = async (event) => {
        event.preventDefault();

        if (!uid || !Number(transactionForm.amount)) {
            return;
        }

        setSaving(true);

        try {
            const payload = {
                amount: Number(transactionForm.amount),
                categoryId: transactionForm.categoryId,
                date: normalizeDateForSubmit(transactionForm.date),
                note: transactionForm.note.trim(),
                type: transactionForm.type,
            };

            if (editingTransactionId) {
                await updateExpenseTransaction(uid, selectedYear, editingTransactionId, payload);
                showToast("Đã cập nhật giao dịch.");
            } else {
                await addExpenseTransaction(uid, selectedYear, payload);
                showToast("Đã thêm giao dịch mới.");
            }

            closeTransactionModal();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTransaction = async (transaction) => {
        const confirmed = window.confirm(`Xóa giao dịch "${transaction.note || "không ghi chú"}"?`);

        if (!confirmed) {
            return;
        }

        try {
            await deleteExpenseTransaction(uid, selectedYear, transaction.id);
            showToast("Đã xóa giao dịch.");
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const handleCategorySubmit = async (event) => {
        event.preventDefault();

        if (!uid || !categoryForm.name.trim()) {
            return;
        }

        setSaving(true);

        try {
            await saveExpenseCategory(uid, {
                ...categoryForm,
                budgetMonthly: Number(categoryForm.budgetMonthly || 0),
                id: editingCategoryId,
                order: editingCategoryId ? categoryMap[editingCategoryId]?.order : Date.now(),
            });
            showToast(editingCategoryId ? "Đã cập nhật danh mục." : "Đã thêm danh mục.");
            closeCategoryModal();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (category) => {
        try {
            const hasTransactions = await categoryHasTransactions(uid, category.id, yearOptions);

            if (hasTransactions) {
                showToast("Không thể xóa danh mục đang có giao dịch.", "error");
                return;
            }

            const confirmed = window.confirm(`Xóa danh mục "${category.name}"?`);

            if (!confirmed) {
                return;
            }

            await deleteExpenseCategory(uid, category.id);
            showToast("Đã xóa danh mục.");
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const handleBudgetSave = async (category) => {
        try {
            await saveExpenseCategory(uid, {
                ...category,
                budgetMonthly: Number(parseMoneyInput(budgetDrafts[category.id] || 0)),
            });
            showToast("Đã lưu danh sách danh mục.");
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const handleRebuildSummary = async () => {
        try {
            await rebuildYearSummary(uid, selectedYear);
            showToast("Đã rebuild summary năm hiện tại.");
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const handleExportCsv = async () => {
        try {
            const yearTransactions = await getYearTransactions(uid, selectedYear);
            const rows = [
                ["id", "date", "type", "category", "amount", "note"],
                ...yearTransactions.map((transaction) => [
                    transaction.id,
                    toDateInputValue(transaction.date),
                    transaction.type,
                    getCategoryName(categoryMap, transaction.categoryId),
                    transaction.amount,
                    transaction.note || "",
                ]),
            ];
            const csv = rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `expense-${selectedYear}.csv`;
            link.click();
            URL.revokeObjectURL(url);
            showToast("Đã export CSV.");
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    const renderDashboard = () => (
        <>
            <div className="expense-admin-stat-grid">
                {[
                    { label: "Số dư", value: formatVnd(balance), tone: balance >= 0 ? "income" : "danger" },
                    { label: "Tổng thu", value: formatVnd(summary.totalIncome), tone: "income" },
                    { label: "Tổng chi", value: formatVnd(summary.totalExpense), tone: "danger" },
                    { label: "Tiết kiệm", value: formatVnd(savingsAmount), tone: "primary" },
                ].map((card) => (
                    <article className={`expense-admin-stat-card is-${card.tone}`} key={card.label}>
                        <span>{card.label}</span>
                        <strong>{card.value}</strong>
                    </article>
                ))}
            </div>

            <section className="expense-admin-chart-grid">
                <article className="expense-admin-card">
                    <div className="expense-admin-card-head">
                        <div>
                            <span>Chi tiêu theo danh mục</span>
                            <h2>{monthLabels[selectedMonth]}</h2>
                        </div>
                        <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
                            {EXPENSE_MONTHS.map((month) => (
                                <option key={month} value={month}>{monthLabels[month]}</option>
                            ))}
                        </select>
                    </div>
                    {summaryLoading || categoriesLoading ? (
                        <ExpenseSkeleton />
                    ) : donutData.length ? (
                        <div className="expense-admin-donut-wrap">
                            <ResponsiveContainer height={260} width="100%">
                                <PieChart>
                                    <Pie data={donutData} dataKey="value" innerRadius={66} outerRadius={96} paddingAngle={3}>
                                        {donutData.map((entry) => (
                                            <Cell fill={entry.color} key={entry.name} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatVnd(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="expense-admin-empty compact">Chưa có chi tiêu trong tháng này.</div>
                    )}
                </article>

                <article className="expense-admin-card">
                    <div className="expense-admin-card-head">
                        <div>
                            <span>12 tháng</span>
                            <h2>Thu vs Chi</h2>
                        </div>
                    </div>
                    {summaryLoading ? (
                        <ExpenseSkeleton />
                    ) : (
                        <ResponsiveContainer height={300} width="100%">
                            <BarChart data={monthlyBarData}>
                                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                                <XAxis dataKey="month" stroke="#8b8b92" />
                                <YAxis stroke="#8b8b92" tickFormatter={(value) => `${Math.round(value / 1000000)}tr`} width={42} />
                                <Tooltip formatter={(value) => formatVnd(value)} />
                                <Bar dataKey="income" fill="#22C55E" radius={[10, 10, 0, 0]} />
                                <Bar dataKey="expense" fill="#EC4899" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </article>
            </section>

            <article className="expense-admin-card">
                <div className="expense-admin-card-head">
                    <div>
                        <span>Top 5</span>
                        <h2>Danh mục chi nhiều nhất năm</h2>
                    </div>
                </div>
                <div className="expense-admin-top-list">
                    {topCategories.length ? topCategories.map((item, index) => (
                        <div className="expense-admin-top-item" key={item.categoryId}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <i style={{ background: item.category.color }}>{item.category.icon}</i>
                            <strong>{item.category.name}</strong>
                            <em>{formatVnd(item.amount)}</em>
                        </div>
                    )) : <div className="expense-admin-empty compact">Chưa có dữ liệu danh mục.</div>}
                </div>
            </article>
        </>
    );

    const renderTransactions = () => (
        <article className="expense-admin-card">
            <div className="expense-admin-card-head">
                <div>
                    <span>Quản lý giao dịch</span>
                    <h2>Thu / Chi năm {selectedYear}</h2>
                </div>
                <button className="expense-admin-primary-btn" type="button" onClick={() => openTransactionModal()}>
                    <FiPlus />
                    Thêm giao dịch
                </button>
            </div>

            <div className="expense-admin-filter-grid">
                <label>
                    Tháng
                    <select value={transactionFilters.month} onChange={(event) => updateTransactionFilter("month", event.target.value)}>
                        <option value="all">Tất cả</option>
                        {EXPENSE_MONTHS.map((month) => (
                            <option key={month} value={month}>{monthLabels[month]}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Danh mục
                    <select value={transactionFilters.categoryId} onChange={(event) => updateTransactionFilter("categoryId", event.target.value)}>
                        <option value="all">Tất cả</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Loại
                    <select value={transactionFilters.type} onChange={(event) => updateTransactionFilter("type", event.target.value)}>
                        <option value="all">Tất cả</option>
                        <option value="income">Thu</option>
                        <option value="expense">Chi</option>
                    </select>
                </label>
                <label>
                    Search ghi chú
                    <div className="expense-admin-search">
                        <FiSearch />
                        <input
                            value={transactionFilters.search}
                            onChange={(event) => updateTransactionFilter("search", event.target.value)}
                            placeholder="Cafe, lương, học tập..."
                        />
                    </div>
                </label>
            </div>

            {transactionsLoading ? (
                <ExpenseSkeleton />
            ) : (
                <>
                    <div className="expense-admin-table-wrap">
                        <table className="expense-admin-table">
                            <thead>
                                <tr>
                                    <th>Ngày</th>
                                    <th>Loại</th>
                                    <th>Danh mục</th>
                                    <th>Ghi chú</th>
                                    <th>Số tiền</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleTransactions.map((transaction) => {
                                    const category = categoryMap[transaction.categoryId] || { icon: "🔧", name: "Khác" };

                                    return (
                                        <tr key={transaction.id}>
                                            <td>{toDateInputValue(transaction.date)}</td>
                                            <td>
                                                <span className={`expense-admin-type is-${transaction.type}`}>
                                                    {transaction.type === "income" ? "Thu" : "Chi"}
                                                </span>
                                            </td>
                                            <td>{category.icon} {category.name}</td>
                                            <td>{transaction.note || "Không ghi chú"}</td>
                                            <td className={`expense-admin-money is-${transaction.type}`}>
                                                {transaction.type === "income" ? "+" : "-"}{formatVnd(transaction.amount)}
                                            </td>
                                            <td>
                                                <div className="expense-admin-row-actions">
                                                    <button type="button" onClick={() => openTransactionModal(transaction)}>
                                                        <FiEdit2 />
                                                    </button>
                                                    <button type="button" onClick={() => handleDeleteTransaction(transaction)}>
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {!filteredTransactions.length && (
                        <div className="expense-admin-empty compact">Không có giao dich phù hợp.</div>
                    )}

                    {visibleCount < filteredTransactions.length && (
                        <button className="expense-admin-load-more" type="button" onClick={() => setVisibleCount((count) => count + 10)}>
                            Load more
                        </button>
                    )}
                </>
            )}
        </article>
    );

    const renderCategories = () => (
        <article className="expense-admin-card">
            <div className="expense-admin-card-head">
                <div>
                    <span>CRUD danh mục</span>
                    <h2>Danh mục thu chi</h2>
                </div>
                <button className="expense-admin-primary-btn" type="button" onClick={() => openCategoryModal()}>
                    <FiPlus />
                    Thêm danh mục
                </button>
            </div>

            {categoriesLoading ? (
                <ExpenseSkeleton />
            ) : (
                <div className="expense-admin-category-grid">
                    {categories.map((category) => (
                        <article className="expense-admin-category-card" key={category.id}>
                            <div className="expense-admin-category-icon" style={{ background: category.color }}>
                                {category.icon}
                            </div>
                            <div>
                                <strong>{category.name}</strong>
                                <span>{formatVnd(category.budgetMonthly || 0)} / tháng</span>
                            </div>
                            <div className="expense-admin-row-actions">
                                <button type="button" onClick={() => openCategoryModal(category)}>
                                    <FiEdit2 />
                                </button>
                                <button type="button" onClick={() => handleDeleteCategory(category)}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </article>
    );

    const renderBudget = () => (
        <article className="expense-admin-card">
            <div className="expense-admin-card-head">
                <div>
                    <span>Budget theo tháng</span>
                    <h2>Đã dùng / hạn mức</h2>
                </div>
                <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
                    {EXPENSE_MONTHS.map((month) => (
                        <option key={month} value={month}>{monthLabels[month]}</option>
                    ))}
                </select>
            </div>

            <div className="expense-admin-budget-list">
                {budgetRows.map((row) => (
                    <div className={`expense-admin-budget-row is-${row.status}`} key={row.id}>
                        <div className="expense-admin-budget-meta">
                            <i style={{ background: row.color }}>{row.icon}</i>
                            <div style={{ display: "flex", gap: "15px"}}>
                                <strong>{row.name}</strong>
                                <span>{formatVnd(row.spent)} / {row.budget ? formatVnd(row.budget) : "Chưa set"}</span>
                            </div>
                        </div>
                        <div className="expense-admin-budget-progress">
                            <span style={{ width: `${Math.min(row.percent, 100)}%` }} />
                        </div>
                        <div className="expense-admin-budget-control">
                            <input
                                inputMode="numeric"
                                value={formatMoneyInput(budgetDrafts[row.id])}
                                onChange={(event) => {
                                    const raw = parseMoneyInput(event.target.value);
                                    setBudgetDrafts((current) => ({ ...current, [row.id]: raw }));
                                }}
                                placeholder="0"
                            />
                            <button type="button" onClick={() => handleBudgetSave(row)}>
                                <FiSave />
                            </button>
                        </div>
                        <strong>{row.percent}%</strong>
                    </div>
                ))}
            </div>
        </article>
    );

    const renderReports = () => {
        const previousBalance = previousSummary.totalIncome - previousSummary.totalExpense;

        return (
            <>
                <section className="expense-admin-chart-grid">
                    <article className="expense-admin-card">
                        <div className="expense-admin-card-head">
                            <div>
                                <span>Báo cáo năm</span>
                                <h2>Thu chi {selectedYear}</h2>
                            </div>
                            <button className="expense-admin-ghost-btn" type="button" onClick={handleExportCsv}>
                                <FiDownload />
                                Export CSV
                            </button>
                        </div>
                        <ResponsiveContainer height={320} width="100%">
                            <BarChart data={monthlyBarData}>
                                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                                <XAxis dataKey="month" stroke="#8b8b92" />
                                <YAxis stroke="#8b8b92" tickFormatter={(value) => `${Math.round(value / 1000000)}tr`} width={42} />
                                <Tooltip formatter={(value) => formatVnd(value)} />
                                <Bar dataKey="income" fill="#22C55E" radius={[10, 10, 0, 0]} />
                                <Bar dataKey="expense" fill="#EC4899" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </article>

                    <article className="expense-admin-card">
                        <div className="expense-admin-report-grid">
                            <div>
                                <span>Năm nay</span>
                                <strong>{formatVnd(balance)}</strong>
                            </div>
                            <div>
                                <span>Năm trước</span>
                                <strong>{formatVnd(previousBalance)}</strong>
                            </div>
                            <div>
                                <span>Tháng chi nhiều nhất</span>
                                <strong>{mostExpensiveMonth?.month || "-"}</strong>
                                <em>{formatVnd(mostExpensiveMonth?.expense || 0)}</em>
                            </div>
                            <div>
                                <span>Tháng chi ít nhất</span>
                                <strong>{leastExpensiveMonth?.month || "-"}</strong>
                                <em>{formatVnd(leastExpensiveMonth?.expense || 0)}</em>
                            </div>
                        </div>
                    </article>
                </section>
            </>
        );
    };

    const renderSettings = () => (
        <article className="expense-admin-card">
            <div className="expense-admin-card-head">
                <div>
                    <span>Cài đặt</span>
                    <h2>Firestore & Summary</h2>
                </div>
                <button className="expense-admin-ghost-btn" type="button" onClick={handleRebuildSummary}>
                    <FiRefreshCw />
                    Rebuild summary
                </button>
            </div>

            <div className="expense-admin-settings-grid">
                <div>
                    <span>User</span>
                    <strong>{user?.email || uid}</strong>
                </div>
                <div>
                    <span>Transactions path</span>
                    <code>users/{uid}/expenses/{selectedYear}/transactions</code>
                </div>
                <div>
                    <span>Summary path</span>
                    <code>users/{uid}/expenses/{selectedYear}/summary/current</code>
                </div>
                <div>
                    <span>Categories path</span>
                    <code>users/{uid}/categories</code>
                </div>
            </div>
        </article>
    );

    const renderSection = () => {
        if (activeSection === "transactions") {
            return renderTransactions();
        }

        if (activeSection === "categories") {
            return renderCategories();
        }

        if (activeSection === "budget") {
            return renderBudget();
        }

        if (activeSection === "reports") {
            return renderReports();
        }

        if (activeSection === "settings") {
            return renderSettings();
        }

        return renderDashboard();
    };

    return (
        <AdminShell
            title="Expense Manager"
            user={user}
            onLogout={handleLogout}
            primaryAction={{
                icon: <FiPlus />,
                label: "New Transaction",
                onClick: () => openTransactionModal(),
            }}
        >
            <section className="admin-manager-hero expense-admin-hero">
                <div>
                    <h2>{sidebarItems.find((item) => item.id === activeSection)?.label || "Dashboard"}</h2>
                    <p>
                        Firestore path: <code>users/{uid}/expenses/{selectedYear}</code>. Summary is stored separately for cheaper dashboard reads.
                    </p>
                </div>
                {overBudgetCount > 0 && (
                    <div className="expense-admin-alert-pill">
                        <FiAlertTriangle />
                        {overBudgetCount} danh mục vượt ngân sách
                    </div>
                )}
            </section>

            <section className="admin-toolbar expense-admin-toolbar">
                <label className="admin-select expense-admin-year-picker">
                    <span>Năm</span>
                    <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>

                <nav className="expense-admin-section-tabs" aria-label="Expense admin sections">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                className={activeSection === item.id ? "is-active" : ""}
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                type="button"
                            >
                                <Icon />
                                {item.label}
                                {item.id === "budget" && overBudgetCount > 0 && (
                                    <b>{overBudgetCount}</b>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </section>

            {(categoryError || summaryError || transactionError) && (
                <div className="admin-alert">{categoryError || summaryError || transactionError}</div>
            )}

            <div className="expense-admin-content">
                {renderSection()}
            </div>

            {isTransactionModalOpen && (
                <div className="expense-admin-modal-backdrop">
                    <form className="expense-admin-modal" onSubmit={handleTransactionSubmit}>
                        <div className="expense-admin-modal-head">
                            <div>
                                <span>{editingTransactionId ? "Sửa giao dịch" : "Giao dịch mới"}</span>
                                <h2>{editingTransactionId ? "Cập nhật thu/chi" : "Thêm thu/chi"}</h2>
                            </div>
                            <button type="button" onClick={closeTransactionModal}>
                                <FiX />
                            </button>
                        </div>

                        <div className="expense-admin-toggle">
                            {["income", "expense"].map((type) => (
                                <button
                                    className={transactionForm.type === type ? "is-active" : ""}
                                    key={type}
                                    type="button"
                                    onClick={() => setTransactionForm((current) => ({ ...current, type }))}
                                >
                                    {type === "income" ? "Thu" : "Chi"}
                                </button>
                            ))}
                        </div>

                        <label>
                            So tien
                            <input
                                inputMode="numeric"
                                value={formatMoneyInput(transactionForm.amount)}
                                onChange={(event) => setTransactionForm((current) => ({
                                    ...current,
                                    amount: parseMoneyInput(event.target.value),
                                }))}
                                placeholder="1.000.000"
                            />
                            <small>{transactionForm.amount ? formatVnd(transactionForm.amount) : "VNĐ"}</small>
                        </label>

                        <div className="expense-admin-icon-grid">
                            {(categories.length ? categories : DEFAULT_EXPENSE_CATEGORIES).map((category) => (
                                <button
                                    className={transactionForm.categoryId === category.id ? "is-active" : ""}
                                    key={category.id}
                                    style={{ "--category-color": category.color }}
                                    type="button"
                                    onClick={() => setTransactionForm((current) => ({ ...current, categoryId: category.id }))}
                                >
                                    <span>{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        <div className="expense-admin-form-grid">
                            <label>
                                Ngày
                                <input
                                    max={`${selectedYear}-12-31`}
                                    min={`${selectedYear}-01-01`}
                                    type="date"
                                    value={transactionForm.date}
                                    onChange={(event) => setTransactionForm((current) => ({ ...current, date: event.target.value }))}
                                />
                            </label>
                            <label>
                                Ghi chú
                                <input
                                    value={transactionForm.note}
                                    onChange={(event) => setTransactionForm((current) => ({ ...current, note: event.target.value }))}
                                    placeholder="Cafe với team..."
                                />
                            </label>
                        </div>

                        <button className="expense-admin-primary-btn" disabled={saving || !Number(transactionForm.amount)} type="submit">
                            <FiSave />
                            {saving ? "Đang lưu..." : "Lưu giao dịch"}
                        </button>
                    </form>
                </div>
            )}

            {isCategoryModalOpen && (
                <div className="expense-admin-modal-backdrop">
                    <form className="expense-admin-modal" onSubmit={handleCategorySubmit}>
                        <div className="expense-admin-modal-head">
                            <div>
                                <span>{editingCategoryId ? "Sửa danh mục" : "Danh mục mới"}</span>
                                <h2>{editingCategoryId ? "Cập nhật danh mục" : "Thêm danh mục"}</h2>
                            </div>
                            <button type="button" onClick={closeCategoryModal}>
                                <FiX />
                            </button>
                        </div>

                        <div className="expense-admin-form-grid">
                            <label>
                                Tên danh mục
                                <input
                                    value={categoryForm.name}
                                    onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                                    placeholder="Ăn uống"
                                />
                            </label>
                            <label>
                                Emoji
                                <input
                                    value={categoryForm.icon}
                                    onChange={(event) => setCategoryForm((current) => ({ ...current, icon: event.target.value }))}
                                    placeholder="🍜"
                                />
                            </label>
                        </div>

                        <div className="expense-admin-form-grid">
                            <label>
                                Màu
                                <input
                                    type="color"
                                    value={categoryForm.color}
                                    onChange={(event) => setCategoryForm((current) => ({ ...current, color: event.target.value }))}
                                />
                            </label>
                            <label>
                                Ngân sách tháng
                                <input
                                    inputMode="numeric"
                                    value={formatMoneyInput(categoryForm.budgetMonthly)}
                                    onChange={(event) => setCategoryForm((current) => ({
                                        ...current,
                                        budgetMonthly: parseMoneyInput(event.target.value),
                                    }))}
                                    placeholder="0"
                                />
                            </label>
                        </div>

                        <button className="expense-admin-primary-btn" disabled={saving || !categoryForm.name.trim()} type="submit">
                            <FiSave />
                            {saving ? "Đang lưu..." : "Lưu danh mục"}
                        </button>
                    </form>
                </div>
            )}

            {toast && (
                <div className={`expense-admin-toast is-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </AdminShell>
    );
};

export default AdminExpense;
