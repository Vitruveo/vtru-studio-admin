export interface AssetType {
    title: string;
    price: number;
    discount: number;
    related: boolean;
    salesPrice: number;
    category: string[];
    gender: string;
    rating: number;
    stock: boolean;
    qty: number;
    colors: string[];
    photo: string;
    id: number | string;
    created: Date;
    description: string;
}

export interface AssetFiterType {
    filterbyTitle?: string;
    name?: string;
    sort?: string;
    icon?: any;
    devider?: boolean;
    onClick?: () => void;
}

export interface AssetCardProps {
    id?: string | number;
    color?: string;
    like: string;
    star: number;
    value?: string;
}
