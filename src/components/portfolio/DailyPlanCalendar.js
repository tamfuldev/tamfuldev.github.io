import React from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiCheckCircle, FiCircle } from "react-icons/fi";
import { firestore } from "../../configs/firebase";
import { sanitizeRichHtml } from "../../utils/blogAdmin";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const copy = {
    empty: {
        en: "No tasks for this day yet.",
        vi: "Chưa có task nào cho hôm nay.",
    },
    footer: {
        en: "Public daily plan - read-only",
        vi: "Daily plan public - chỉ xem",
    },
    loading: {
        en: "Loading tasks...",
        vi: "Đang tải task...",
    },
    monthLoading: {
        en: "Syncing month from Firestore",
        vi: "Đang động bộ tháng từ Firestore",
    },
    subtitle: {
        en: "Pick a day to see planned work, priorities, and completion status from Firestore.",
        vi: "Chọn ngày để xem task, priority và trạng thái từ Firestore.",
    },
    title: {
        en: "Daily Plan",
        vi: "Daily Plan",
    },
};

const priorityLabels = {
    high: "High",
    low: "Low",
    medium: "Medium",
};

const statusLabels = {
    done: "Done",
    todo: "Todo",
};

const toDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const fromDateKey = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);

    return new Date(year, month - 1, day);
};

const getMonthBounds = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        endKey: toDateKey(end),
        startKey: toDateKey(start),
    };
};

const buildCalendarDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let index = 0; index < firstDay.getDay(); index += 1) {
        days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
        days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
        days.push(null);
    }

    return days;
};

const normalizeStatus = (status) => {
    const normalized = String(status || "todo").toLowerCase();

    return normalized === "done" || normalized === "completed" ? "done" : "todo";
};

const normalizePriority = (priority) => {
    const normalized = String(priority || "medium").toLowerCase();

    return ["high", "medium", "low"].includes(normalized) ? normalized : "medium";
};

const sortTasks = (a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 9999;
    const orderB = Number.isFinite(b.order) ? b.order : 9999;

    if (orderA !== orderB) {
        return orderA - orderB;
    }

    return a.title.localeCompare(b.title);
};

const normalizeTask = (task, index = 0) => ({
    ...task,
    id: task.id || `inline-task-${index}`,
    order: Number.isFinite(task.order) ? task.order : index,
    priority: normalizePriority(task.priority),
    status: normalizeStatus(task.status),
    title: task.title || "Untitled task",
});

const DailyPlanCalendar = ({ language = "en" }) => {
    const [currentMonth, setCurrentMonth] = React.useState(() => new Date());
    const [error, setError] = React.useState("");
    const [monthPlans, setMonthPlans] = React.useState({});
    const [monthSyncing, setMonthSyncing] = React.useState(true);
    const [selectedDateKey, setSelectedDateKey] = React.useState(() => toDateKey());
    const [tasks, setTasks] = React.useState([]);
    const [tasksLoading, setTasksLoading] = React.useState(true);

    const calendarDays = React.useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);
    const selectedDate = React.useMemo(() => fromDateKey(selectedDateKey), [selectedDateKey]);
    const selectedPlan = monthPlans[selectedDateKey];
    const monthLabel = currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    React.useEffect(() => {
        const { endKey, startKey } = getMonthBounds(currentMonth);

        setMonthSyncing(true);

        const unsubscribe = firestore
            .collection("dailyPlan")
            .where("date", ">=", startKey)
            .where("date", "<=", endKey)
            .onSnapshot(
                (snapshot) => {
                    const plansByDate = {};

                    snapshot.docs.forEach((doc) => {
                        const plan = { id: doc.id, ...doc.data() };
                        const dateKey = plan.date || doc.id;

                        plansByDate[dateKey] = {
                            ...plan,
                            tasks: Array.isArray(plan.tasks) ? plan.tasks.map(normalizeTask) : [],
                        };
                    });

                    setMonthPlans(plansByDate);
                    setError("");
                    setMonthSyncing(false);
                },
                (snapshotError) => {
                    setError(snapshotError.message);
                    setMonthSyncing(false);
                }
            );

        return () => unsubscribe();
    }, [currentMonth]);

    React.useEffect(() => {
        setTasksLoading(true);

        const unsubscribe = firestore
            .collection("dailyPlan")
            .doc(selectedDateKey)
            .collection("tasks")
            .onSnapshot(
                (snapshot) => {
                    const inlineTasks = monthPlans[selectedDateKey]?.tasks || [];
                    const nextTasks = snapshot.docs
                        .map((doc) => normalizeTask({ id: doc.id, ...doc.data() }))
                        .concat(inlineTasks)
                        .sort(sortTasks);

                    setTasks(nextTasks);
                    setTasksLoading(false);
                },
                (snapshotError) => {
                    setError(snapshotError.message);
                    setTasks([]);
                    setTasksLoading(false);
                }
            );

        return () => unsubscribe();
    }, [monthPlans, selectedDateKey]);

    const monthStats = React.useMemo(() => {
        const plannedDays = Object.keys(monthPlans).length;
        const done = tasks.filter((task) => task.status === "done").length;

        return {
            done,
            plannedDays,
            total: tasks.length,
        };
    }, [monthPlans, tasks]);

    const goToMonth = (offset) => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);

        setCurrentMonth(nextMonth);
        setSelectedDateKey(toDateKey(nextMonth));
    };

    const handleSelectDate = (date) => {
        const dateKey = toDateKey(date);

        setSelectedDateKey(dateKey);

        if (date.getMonth() !== currentMonth.getMonth() || date.getFullYear() !== currentMonth.getFullYear()) {
            setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
        }
    };

    return (
        <div className="portfolio-page">
            <section className="portfolio-daily-plan-wrap">
                <header className="portfolio-daily-plan-hero">
                    <div>
                        <h1>{pick(copy.title, language)}</h1>
                        {/* <p>{pick(copy.subtitle, language)}</p> */}
                    </div>
                    <div className="portfolio-daily-plan-summary">
                        <FiCalendar />
                        <strong>{monthStats.plannedDays}</strong>
                        <span>planned days this month</span>
                    </div>
                </header>

                {error && <div className="portfolio-daily-plan-state is-error">{error}</div>}

                <section className="portfolio-daily-plan-grid">
                    <div className="portfolio-calendar-card">
                        <div className="portfolio-calendar-head">
                            <button type="button" onClick={() => goToMonth(-1)} aria-label="Previous month">
                                <FiChevronLeft />
                            </button>
                            <div>
                                <strong>{monthLabel}</strong>
                                {monthSyncing && <span>{pick(copy.monthLoading, language)}</span>}
                            </div>
                            <button type="button" onClick={() => goToMonth(1)} aria-label="Next month">
                                <FiChevronRight />
                            </button>
                        </div>

                        <div className="portfolio-calendar-weekdays">
                            {dayLabels.map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>

                        <div className="portfolio-calendar-days">
                            {calendarDays.map((date, index) => {
                                if (!date) {
                                    return <span className="portfolio-calendar-day is-empty" key={`empty-${index}`} />;
                                }

                                const dateKey = toDateKey(date);
                                const isSelected = dateKey === selectedDateKey;
                                const isToday = dateKey === toDateKey();
                                const hasPlan = Boolean(monthPlans[dateKey]);

                                return (
                                    <button
                                        type="button"
                                        className={[
                                            "portfolio-calendar-day",
                                            isSelected ? "is-selected" : "",
                                            isToday ? "is-today" : "",
                                            hasPlan ? "has-plan" : "",
                                        ].filter(Boolean).join(" ")}
                                        key={dateKey}
                                        onClick={() => handleSelectDate(date)}
                                    >
                                        <span>{date.getDate()}</span>
                                        {hasPlan && <i aria-hidden="true" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="portfolio-day-tasks-card">
                        <div className="portfolio-day-tasks-head">
                            <div>
                                <span>{selectedDateKey}</span>
                                <h2>
                                    {selectedDate.toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        weekday: "long",
                                    })}
                                </h2>
                            </div>
                            <div className="portfolio-day-task-count">
                                <strong>{monthStats.done}/{monthStats.total}</strong>
                                <span>done</span>
                            </div>
                        </div>

                        {selectedPlan?.note && <p className="portfolio-day-note">{selectedPlan.note}</p>}

                        {tasksLoading && (
                            <div className="portfolio-daily-plan-state">{pick(copy.loading, language)}</div>
                        )}

                        {!tasksLoading && !tasks.length && (
                            <div className="portfolio-daily-plan-state">{pick(copy.empty, language)}</div>
                        )}

                        <div className="portfolio-day-task-list">
                            {tasks.map((task) => (
                                <article className={`portfolio-day-task is-${task.status}`} key={task.id}>
                                    <span className="portfolio-day-task-status">
                                        {task.status === "done" ? <FiCheckCircle /> : <FiCircle />}
                                    </span>
                                    <div>
                                        <strong>{task.title}</strong>
                                        {task.notes && (
                                            <div
                                                className="portfolio-day-task-notes"
                                                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(task.notes) }}
                                            />
                                        )}
                                    </div>
                                    <div className="portfolio-day-task-badges">
                                        <span className={`portfolio-priority-badge is-${task.priority}`}>
                                            {priorityLabels[task.priority]}
                                        </span>
                                        <span className={`portfolio-status-badge is-${task.status}`}>
                                            {statusLabels[task.status]}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </aside>
                </section>
            </section>

            <PageFooter>{pick(copy.footer, language)}</PageFooter>
        </div>
    );
};

export default DailyPlanCalendar;
