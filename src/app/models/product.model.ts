export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    manufacturer: string;
    category: string;
    image: string;
    stock: number;
    date: Date;
}

export interface Cart {
    product: Product;
    quantity: number;
    total: number;
    id: string;
    uid: string;
}