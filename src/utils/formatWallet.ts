export const validateCryptoAddress = (address: string): boolean => {
    const patterns = [
        /^0x[a-fA-F0-9]{40}$/, // Ethereum, Binance Smart Chain, etc.
        /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Bitcoin
        /^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/, // Bitcoin Bech32
        /^[A-Za-z0-9]{42}$/, // Solana
    ];

    return patterns.some((pattern) => pattern.test(address));
};

export const formatWallet = (addressF?: string) => {
    if (addressF && validateCryptoAddress(addressF)) {
        return `${addressF.substring(0, 6)}...${addressF.substring(addressF.length - 4)}`;
    }
    return addressF;
};
