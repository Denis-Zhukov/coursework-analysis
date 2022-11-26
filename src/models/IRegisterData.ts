export interface IRegisterData {
    username: string;
    password: string;
    email: string;
    shops: IShopInfo[];
}

interface IShopInfo {
    shopName: string;
    location: ILocation;
    getProducts: string;
    getOrders: string;
}

interface ILocation {
    country: string;
    city: string;
    street: string;
    restOfAddress: string | undefined | null;
}