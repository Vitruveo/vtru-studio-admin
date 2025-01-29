export const hasTruthyObject = (obj: any): boolean => {
    return Object.values(obj).some((value) => {
        if (value && typeof value === 'object') {
            return hasTruthyObject(value);
        }
        return Boolean(value);
    });
};
