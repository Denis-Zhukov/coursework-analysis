import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../../MySqlService";
import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {ICountry} from "../../../../models/Addresses/ICountry";


export class CountryService implements ICRUD<ICountry> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(country: ICountry) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `countries` (`name`) VALUES (?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [country.name]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `countries` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(country: ICountry) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `countries` SET `name`=? WHERE `countries`.id = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [country.name, country.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `countries` WHERE `countries`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.country, new CountryService());