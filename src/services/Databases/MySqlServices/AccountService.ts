import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {services} from "../services";
import {ICategory} from "../../../models/ICategory";
import {IAccount} from "../../../models/IAccount";


export class AccountService implements ICRUD<IAccount> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(acc: IAccount) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `accounts`(`email`, `username`, `password_hash`, `contact_details`) VALUES (?,?,?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [acc.email, acc.username, acc.passwordHash, acc.contactDetails]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `accounts` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(acc: IAccount) {
        const connection = await this.pool.getConnection();

        try {
            const query = 'UPDATE `accounts` SET `email`=?,`username`=?,`contact_details`=? WHERE id=?';

            const [result] = await connection.execute<mysql.OkPacket>(query, [acc.email, acc.username, acc.contactDetails, acc.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `accounts` WHERE `accounts`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.account, new AccountService());