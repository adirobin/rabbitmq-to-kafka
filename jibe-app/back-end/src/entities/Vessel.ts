import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Vessel')
export class Vessel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name?: string;

    @Column({ type: 'varchar' })
    type: string;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true, name: 'length_meters' })
    lengthMeters?: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'max_speed_knots' })
    maxSpeedKnots?: number;

    @Column({ type: 'varchar' })
    owner: string;

    @Column({ type: 'varchar' })
    flag: string;

    @Column({ type: 'varchar', name: 'IMO_number' })
    IMONumber: string = "";

    @Column({ type: 'varchar', name: 'MMSI_number' })
    MMSINumber: string = "";

    @Column({ type: 'varchar', name: 'Home_Port' })
    HomePort: string = "";
}
