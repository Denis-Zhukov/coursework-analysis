import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../../MySqlService";
import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {IAddress} from "../../../../models/Addresses/IAddress";


export class AddressService implements ICRUD<IAddress> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(address: IAddress) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `addresses` (`id_street`, `rest_of_address`) VALUES (?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [address.idStreet, address.restOfAddress]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `addresses` ORDER BY id LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(address: IAddress) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `addresses` SET `id_street`=?, `rest_of_address`=? WHERE `addresses`.id = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [address.idStreet, address.restOfAddress, address.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `addresses` WHERE `addresses`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.address, new AddressService());