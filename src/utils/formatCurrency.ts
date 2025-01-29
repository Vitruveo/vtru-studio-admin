export function formatCurrency({ value }: { value: number }) {
    const language = navigator.language || 'en-US';
    const formatedPrice = value.toLocaleString(language, {
        style: 'currency',
        currency: 'USD',
    });
    return formatedPrice.replace('US', '');
}
