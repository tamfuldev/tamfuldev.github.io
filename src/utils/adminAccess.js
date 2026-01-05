const defaultDevelopmentAdminEmails = ["admin@gmail.com"];

const getDevelopmentAdminEmails = () => {
    const envEmails = process.env.REACT_APP_ADMIN_EMAILS || "";
    const configuredEmails = envEmails
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    return new Set([...defaultDevelopmentAdminEmails, ...configuredEmails]);
};

const hasDevelopmentAdminEmail = (user) => {
    if (process.env.NODE_ENV !== "development") {
        return false;
    }

    const email = user?.email?.toLowerCase();

    return Boolean(email && getDevelopmentAdminEmails().has(email));
};

export const hasAdminClaim = async (user) => {
    if (!user || typeof user.getIdTokenResult !== "function") {
        return false;
    }

    if (hasDevelopmentAdminEmail(user)) {
        return true;
    }

    const token = await user.getIdTokenResult(true);

    return token?.claims?.admin === true;
};
