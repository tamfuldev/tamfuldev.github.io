const defaultAdminEmails = ["admin@gmail.com"];

export const getAdminEmails = () => {
    const envEmails = process.env.REACT_APP_ADMIN_EMAILS || "";
    const configuredEmails = envEmails
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    return new Set([...defaultAdminEmails, ...configuredEmails]);
};

export const isAdminUser = (user) => {
    const email = user?.email?.toLowerCase();

    return Boolean(email && getAdminEmails().has(email));
};
