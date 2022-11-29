import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../../MySqlService";
import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {ICountry} from "../../../../models/Addresses/ICountry";
import {ICity} from "../../../../models/Addresses/ICity";


export class CityService implements ICRUD<ICountry> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(city: ICity) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `cities` (`name`, `id_country`) VALUES (?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [city.name, city.idCountry]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `cities` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(city: ICity) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `cities` SET `name`=?, `id_country`=? WHERE `cities`.id = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [city.name, city.idCountry, city.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `cities` WHERE `cities`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.city, new CityService());