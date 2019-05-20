export interface CrapAppExport {
    farm: Farm;
}
export interface Farm {
    "file-version": number;
    "app-version": string;
    unique_id: string;
    deleted: number;
    name: string;
    cost_n: number;
    cost_p: number;
    cost_k: number;
    rainfall: string;
    cost_s: number;
    cost_m: number;
    fields?: (Field)[] | undefined;
}
export interface Field {
    unique_id: string;
    deleted: number;
    name: string;
    parent: string;
    soil: string;
    crop: Array<Array<string>>;
    previous_crop: string;
    soil_test_p: string;
    soil_test_k: string;
    soil_test_m: string;
    regularly_manure: string;
    recently_grown_grass: string;
    size: number;
    coords?: (Coord)[] | undefined;
    events?: (Event)[] | undefined;
}
export interface Coord {
    name: string;
    parent: string;
    order: number;
    lat: number;
    lng: number;
}
export interface Event {
    unique_id: string;
    deleted: number;
    name: string;
    parent: string;
    type: string;
    date: string;
    nutrients_n: number;
    nutrients_p: number;
    nutrients_k: number;
    total_nutrients_n: number;
    total_nutrients_p: number;
    total_nutrients_k: number;
    require_n: number;
    require_p: number;
    require_k: number;
    sns: number;
    soil: string;
    size: number;
    amount: number;
    quality: string;
    application: string;
    season: string;
    crop: string[][];
    nutrients_s?: number | undefined;
    nutrients_m?: number | undefined;
    total_nutrients_s?: number | undefined;
    total_nutrients_m?: number | undefined;
    require_s?: number | undefined;
    require_m?: number | undefined;
}
