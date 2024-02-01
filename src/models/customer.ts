export interface Customer {
    _id: string;
    name: string;
    address: string;
    registration: string;
    bankAccount: string;
    bankName: string;
    vat?: string;
    phone?: string;
    email?: string;
    additionalInfo?: string  
}