import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "jibe",
    password: "admin",
    database: "mypsdb",
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: true,
})
