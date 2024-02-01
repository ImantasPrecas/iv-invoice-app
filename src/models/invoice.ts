export interface Service {
    title: string;
    quantity: number;
    price: number;
    totalPrice: number
}

export interface Invoice {
    _id: string;
    userId: number;
    customerId: number;
    date: string;
    invoiceNumber: string;
    services: Service[]
    totalPrice: number
}