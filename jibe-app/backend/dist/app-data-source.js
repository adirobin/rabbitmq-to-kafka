"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVessel = exports.getVessels = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: process.env.POSTGRES_USER || 'jibe',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'mypsdb',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    port: Number(process.env.POSTGRES_PORT) || 5432, // or the port your PostgreSQL server is running on
});
const getVessels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        const result = yield client.query('SELECT * FROM vessel');
        console.log('Vessels from database:', result.rows);
        const vessels = result.rows.map((row) => {
            return {
                id: row.id,
                name: row.name,
                type: row.type,
                length_meters: row.length_meters,
                max_speed_knots: row.max_speed_knots,
                owner: row.owner,
                flag: row.flag,
                imo_number: row.imo_number,
                mmsi_number: row.mmsi_number,
            };
        });
        console.log('Vessels:', vessels);
        return vessels;
        yield client.release();
    }
    catch (error) {
        console.error('Error fetching vessels from the database:', error);
        return [];
    }
    finally {
    }
});
exports.getVessels = getVessels;
const addVessel = (vesselData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        console.log('Vessel data received (addVessel):', vesselData);
        const q = yield client.query("SELECT MAX(id) as id FROM vessel");
        if (q.rowCount === 0)
            throw new Error('No vessels found');
        const id = q.rows[0].id + 1;
        console.log('Vessel id:', id);
        yield client.query("INSERT INTO vessel (id, name, type, length_meters, max_speed_knots, owner, flag, IMO_number, MMSI_number) VALUES ("
            + id + ",'  " + vesselData.name + "', '" + vesselData.type + "', "
            + vesselData.length_meters + ", " + vesselData.max_speed_knots
            + ", '" + vesselData.owner + "', '" + vesselData.flag + "', '"
            + vesselData.IMO_number + "', '" + vesselData.MMSI_number + "')");
        console.log('Vessel data added to the database:', vesselData);
        yield client.release();
    }
    catch (error) {
        console.error('Error adding vessel data to the database:', error);
    }
    finally {
    }
});
exports.addVessel = addVessel;
