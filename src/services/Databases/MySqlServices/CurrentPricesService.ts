import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../MySqlService";
import {services} from "../services";
import {ICurrentPrice} from "../../../models/ICurrentPrice";
import {ICurrentPricesService} from "../interfaces/ICurrentPricesService";


export class CurrentPricesService implements ICurrentPricesService {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(data: ICurrentPrice) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `current_prices`(`id_product`, `id_shop`, `price`, `last_update`) VALUES (?,?,?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [data.idProduct, data.idShop, data.price, data.update]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async addMany(datum: ICurrentPrice[]) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT IGNORE INTO `current_prices`(`id_product`, `id_shop`, `price`, `last_update`) VALUES ";
            query += new Array(datum.length).fill(`(?,?,?,?)`);
            const params = datum.map(cp => [cp.id, cp.idShop, cp.price, new Date()]).flat();
            const [result] = await connection.execute<mysql.OkPacket>(query, params);
            return result.fieldCount;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `current_prices` ORDER BY id LIMIT ? OFFSET ?";
            const [data] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return data;
        } finally {
            connection.release();
        }
    }

    public async getByIdProductAndIdShop(count: number, offset: number, idProduct: number, idShop: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `current_prices` WHERE id_product=? AND id_shop=? ORDER BY id LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [idProduct, idShop, count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(data: ICurrentPrice) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `current_prices` SET `price`=?,`last_update`=? WHERE id_shop=? AND id_product=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [data.price, new Date(), data.idShop, data.idProduct]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `current_prices` WHERE id_shop=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async deleteIdProductAndByIdShop(idProduct: number, idShop: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `current_prices` WHERE id_product=? and id_shop=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [idProduct, idShop]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.currentPrices, new CurrentPricesService());