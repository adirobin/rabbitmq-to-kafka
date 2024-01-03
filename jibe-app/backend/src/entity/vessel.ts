

export interface Vessel {
    id: number;
    name: string;
    type: string;
    length_meters: number;
    max_speed_knots: number;
    owner: string;
    flag: string;
    imo_number: string;
    mmsi_number: string;
}
