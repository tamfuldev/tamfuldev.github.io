const defaultDevelopmentAdminEmails = ["admin@gmail.com"];

const getConfiguredAdminEmails = () => {
    const envEmails = process.env.REACT_APP_ADMIN_EMAILS || "";

    return new Set(
        envEmails
            .split(",")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
    );
};

const getDevelopmentAdminEmails = () =>
    new Set([...defaultDevelopmentAdminEmails, ...getConfiguredAdminEmails()]);

const hasConfiguredAdminEmail = (user) => {
    const email = user?.email?.toLowerCase();

    return Boolean(email && getConfiguredAdminEmails().has(email));
};

const hasDevelopmentAdminEmail = (user) => {
    if (process.env.NODE_ENV !== "development") {
        return false;
    }

    const email = user?.email?.toLowerCase();

    return Boolean(email && getDevelopmentAdminEmails().has(email));
};

const hasFirestoreAdminProfile = async (user) => {
    if (!user?.uid) {
        return false;
    }

    try {
        const { firestore } = await import("../configs/firebase");
        const snapshot = await firestore.collection("admins").doc(user.uid).get();

        return snapshot.exists;
    } catch {
        return false;
    }
};

export const hasAdminClaim = async (user) => {
    if (!user || typeof user.getIdTokenResult !== "function") {
        return false;
    }

    if (hasDevelopmentAdminEmail(user) || hasConfiguredAdminEmail(user)) {
        return true;
    }

    if (await hasFirestoreAdminProfile(user)) {
        return true;
    }

    const token = await user.getIdTokenResult(true);

    return token?.claims?.admin === true;
};
