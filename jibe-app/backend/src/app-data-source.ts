import {Pool, QueryResult} from 'pg';
import {Vessel} from "./entity/vessel";

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'jibe',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'mypsdb',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    port: Number(process.env.POSTGRES_PORT) || 5432, // or the port your PostgreSQL server is running on
});

export const getVessels = async (): Promise<Vessel[]> => {
    try {
        const client = await pool.connect();
        const result: QueryResult<Vessel>  = await client.query('SELECT * FROM vessel');
        console.log('Vessels from database:', result.rows);
        const vessels: Vessel[] = result.rows.map((row) => {
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
        await client.release();
    } catch (error) {
        console.error('Error fetching vessels from the database:', error);
        return [];
    } finally {
    }

}

export const addVessel = async (vesselData:any) => {
    try {
        const client = await pool.connect();
        console.log('Vessel data received (addVessel):', vesselData);
        const q = await client.query<Vessel>("SELECT MAX(id) as id FROM vessel");
        if (q.rowCount === 0) throw new Error('No vessels found');
        const id = q.rows[0].id + 1;
        console.log('Vessel id:', id);
        await client.query("INSERT INTO vessel (id, name, type, length_meters, max_speed_knots, owner, flag, IMO_number, MMSI_number) VALUES ("
            + id + ",'  " + vesselData.name + "', '" + vesselData.type + "', "
            + vesselData.length_meters + ", " + vesselData.max_speed_knots
            + ", '" + vesselData.owner + "', '" + vesselData.flag + "', '"
            + vesselData.IMO_number + "', '" + vesselData.MMSI_number + "')");
        console.log('Vessel data added to the database:', vesselData);
        await client.release();
    } catch (error) {
        console.error('Error adding vessel data to the database:', error);
    } finally {
    }
}
