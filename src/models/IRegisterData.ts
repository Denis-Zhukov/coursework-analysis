export interface IRegisterData {
    username: string;
    password: string;
    email: string;
    shop: IShopInfo[];
}

interface IShopInfo {
    shopName: string;
    location: string;
    getProducts: string;
    getOrders: string;
}