import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {services} from "../services";
import {Id} from "../../../types/types";
import {ICategory} from "../../../models/ICategory";
import {RefinedException} from "../../../exceptions/handler/RefinedException";


export class CategoryService implements ICRUD<ICategory> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(category: ICategory) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `categories`(`name`) VALUES (?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [category.name]);

            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `categories` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(category: ICategory) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `categories` SET `name`=? WHERE `categories`.id = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [category.name, category.id]);

            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `categories` WHERE `categories`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.category, new CategoryService());