export interface User {
    uid: string;
    firstName: null,
    lastName: null,
    userName: string;
    email: string;
    phoneNum: string;
    mobileNum: string;
    password: string;
    photoURL: string;
    birthday: Date;
    role: [
        'write' | 'read' | 'admin'
    ];
}

export class Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export class UserAddress {
    uid: string;
    address: Address;
}

export class payment {
    uid: string;
    cardNumber: string;
    cardName: string;
    cardExpiration: string;
    cardCVV: string;
}