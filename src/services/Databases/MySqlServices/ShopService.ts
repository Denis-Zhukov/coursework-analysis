import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {services} from "../services";
import {ICategory} from "../../../models/ICategory";
import {IShop} from "../../../models/IShop";


export class ShopService implements ICRUD<ICategory> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(shop: IShop) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `shops`(`name`, `address`, `getProducts`, `getOrders`) VALUES (?,?,?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [shop.name, shop.address, shop.getProducts, shop.getOrders]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `shops` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(shop: IShop) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `shops` SET `name`=?,`address`=?,`getProducts`=?,`getOrders`=? WHERE id=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [shop.name, shop.address, shop.getProducts, shop.getOrders, shop.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `shops` WHERE `shops`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.shop, new ShopService());