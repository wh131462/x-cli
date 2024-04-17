export const nameConverter = (name) => {
    if (!name) return '';
    return Array.isArray(name) ? name.join(' ') : name;
};
