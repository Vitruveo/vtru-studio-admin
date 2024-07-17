const localeDate = (value: string) => {
    const date = new Date(value);
    const language = navigator.language || 'en-US';
    return date.toLocaleString(language, {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const localePrice = (value?: number) => {
    if (!value) return '';
    const language = navigator.language || 'en-US';
    const formatedPrice = value.toLocaleString(language, {
        style: 'currency',
        currency: 'USD',
    });
    return formatedPrice.replace('US', '');
};

export { localeDate, localePrice };
