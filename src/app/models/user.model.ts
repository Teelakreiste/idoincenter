export interface User {
    uid: string;
    name: string;
    email: string;
    password: string;
    photoURL: string;
    age: number;
    birthday: Date;
    role: [
        'write' | 'read' | 'admin'
    ];
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface UserAddress {
    uid: string;
    address: Address;
}