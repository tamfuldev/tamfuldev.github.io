export const localized = (en, vi) => ({ en, vi });

export const pick = (value, language) => {
    if (typeof value === "string") {
        return value;
    }

    return value?.[language] ?? value?.en ?? "";
};
