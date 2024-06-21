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

export default localeDate;
