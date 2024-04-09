export const nameConverter = (name) => {
    return Array.isArray(name) ? name.join(' ') : name;
};
