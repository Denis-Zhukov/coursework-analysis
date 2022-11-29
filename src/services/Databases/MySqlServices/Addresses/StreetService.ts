import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../../MySqlService";
import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {ICountry} from "../../../../models/Addresses/ICountry";
import {IStreet} from "../../../../models/Addresses/IStreet";


export class StreetService implements ICRUD<ICountry> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(city: IStreet) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `streets` (`name`, `id_city`) VALUES (?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [city.name, city.idCity]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `streets` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(city: IStreet) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `streets` SET `name`=?, `id_city`=? WHERE `streets`.id = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [city.name, city.idCity, city.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `streets` WHERE `streets`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.street, new StreetService());