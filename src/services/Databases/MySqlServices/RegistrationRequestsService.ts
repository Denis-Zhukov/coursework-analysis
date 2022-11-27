import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../MySqlService";
import {services} from "../services";
import {IRegisterData} from "../../../models/IRegisterData";
import {RefinedException} from "../../../exceptions/handler/RefinedException";
import {IClient} from "../interfaces/IClient";
import {IResendVerifyEmail} from "../../../models/IResendVerifyEmail";


export class RegistrationRequestsService implements IClient {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(data: IRegisterData) {
        const connection = await this.pool.getConnection();

        try {
            let query = "SELECT email, username FROM registration_requests WHERE email=? OR username=?";
            const [rows] = await connection.execute<mysql.RowDataPacket[]>(query, [data.email, data.username]);

            if (rows.length) {
                let err = "";
                rows[0].email === data.email && (err += `There is already a user with email ${data.email}\n`);
                rows[0].username === data.username && (err += `There is already a user with username ${data.username}`);
                throw new RefinedException(err, 400);
            }

            query = "INSERT INTO `registration_requests`(`email`, `username`, `password_hash`, `contact_details`, `token`) VALUES (?,?,?,?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [data.email, data.username, data.passwordHash, data.contactDetails, data.token]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async verifyEmail(token: string) {
        const connection = await this.pool.getConnection();
        try {
            let query = "UPDATE `registration_requests` SET `confirmed`=? WHERE token=? AND confirmed=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [true, token, false]);
            return result.changedRows;
        } finally {
            connection.release();
        }
    }

    public async resendVerifyEmail(data: IResendVerifyEmail) {
        const connection = await this.pool.getConnection();
        try {
            let query = "SELECT confirmed from `registration_requests` WHERE email=?";
            let [rows] = await connection.execute<mysql.RowDataPacket[]>(query, [data.email]);

            if (!rows.length) throw new RefinedException("No such account with email " + data.email, 400);
            if (rows[0]?.confirmed) throw new RefinedException("Email has already confirmed", 400);

            query = "UPDATE `registration_requests` SET `token`=? WHERE email=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [data.token, data.email]);

            return result.changedRows;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `registration_requests` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(data: IRegisterData) {
        const connection = await this.pool.getConnection();

        try {
            let result: any;
            if (data.passwordHash) {
                const query = "UPDATE `registration_requests` SET `email`=?,`username`=?,`password_hash`=?,`contact_details`=?,`confirmed`=? WHERE id=?";
                [result] = await connection.execute<mysql.OkPacket>(query, [data.email, data.username, data.passwordHash, data.contactDetails, data.confirmed, data.id]);
            } else {
                const query = "UPDATE `registration_requests` SET `email`=?,`username`=?,`contact_details`=?,`confirmed`=? WHERE id=?";
                [result] = await connection.execute<mysql.OkPacket>(query, [data.email, data.username, data.contactDetails, data.confirmed, data.id]);
            }

            return result.changedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `registration_requests` WHERE `registration_requests`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.registrationRequest, new RegistrationRequestsService());