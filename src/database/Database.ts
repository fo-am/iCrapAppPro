/**
 * React Native SQLite Demo
 * Copyright (c) 2018 Bruce Lefebvre <bruce@brucelefebvre.com>
 * https://github.com/blefebvre/react-native-sqlite-demo/blob/master/LICENSE
 */
import SQLite from "react-native-sqlite-storage";
import { DatabaseInitialization } from "./DatabaseInit";

import Farm from "../model/Farm";
import Field from "../model/field";
import Manure from "../model/manure";

import SpreadEvent from "../model/spreadEvent";

export interface Database {
    open(): Promise<SQLite.SQLiteDatabase>;
    close(): Promise<void>;

    getFarms(): Promise<Array<Farm>>;
    getFarm(id: number): Promise<Farm>;
    saveFarm(farm: Farm): Promise<void>;
    deleteFarm(farm: Farm): Promise<void>;

    getFields(farm: Farm): Promise<Array<Field>>;
    getField(id: number): Promise<Field>;
    saveField(field: Field): Promise<void>;
    deleteField(field: Field): Promise<void>;

    getSpreadEvents(field: Field): Promise<Array<SpreadEvent>>;
    getSpreadEvent(id: number): Promise<SpreadEvent>;
    saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void>;
    deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void>;

    getManures(): Promise<Array<Manure>>;
    saveManure(manure: Manure): Promise<void>;
    deleteManure(manure: Manure): Promise<void>;

    //   getAppSettings(): Promise<AppSettings>;
    //   saveAppSettings(appSettings: AppSettings): Promise<void>;
}

class DatabaseImpl implements Database {
    private databaseName = "CrapAppDatabase.db";
    private database: SQLite.SQLiteDatabase | undefined;

    // Open the connection to the database
    public open(): Promise<SQLite.SQLiteDatabase> {
        SQLite.DEBUG(true);
        SQLite.enablePromise(true);
        let databaseInstance: SQLite.SQLiteDatabase;

        return SQLite.openDatabase({
            name: this.databaseName,
            location: "default"
        })
            .then(db => {
                databaseInstance = db;
                console.log("[db] Database open!");

                // Perform any database initialization or updates, if needed
                const databaseInitialization = new DatabaseInitialization();
                return databaseInitialization.updateDatabaseTables(
                    databaseInstance
                );
            })
            .then(() => {
                this.database = databaseInstance;
                return databaseInstance;
            });
    }

    // Close the connection to the database
    public close(): Promise<void> {
        if (this.database === undefined) {
            return Promise.reject(
                "[db] Database was not open; unable to close."
            );
        }
        return this.database.close().then(status => {
            console.log("[db] Database closed.");
            this.database = undefined;
        });
    }

    public getFarms(): Promise<Array<Farm>> {}
    public getFarm(id: number): Promise<Farm> {}
    public saveFarm(farm: Farm): Promise<void> {}
    public deleteFarm(farm: Farm): Promise<void> {}

    public getFields(farm: Farm): Promise<Array<Field>> {}
    public getField(id: number): Promise<Field> {}
    public saveField(field: Field): Promise<void> {
        // look in database to see if we have this ID
        // if so then update with the values here
        // else add a new record
        if (field === undefined) {
            return Promise.reject(
                Error(`Could not add item to undefined list.`)
            );
        }
        // https://www.sqlite.org/lang_UPSERT.html
        return this.getDatabase()
            .then(db =>
                db.executeSql(
                    `Insert into Field (
                    FarmId,
                    Field-Unique-Id,
                    Name,
                    Coordinates,
                    Soil,
                    Crop,
                    Previous-Crop,
                    Soil-Test-P,
                    Soil-Test-K,
                    Regular-Manure,
                    Recent-Grass,
                    Size) values(?,?,?,?,?,?,?,?,?,?,?,?)
                 ON CONFLICT(Field-Unique_Id)
                 Do
                 UPDATE SET
                 FarmId = excluded.FarmId,
                 Field-Unique-Id = excluded,
                 Name = excluded.Name,
                 Coordinates = excluded.Coordinates,
                 Soil = excluded.Soil,
                 Crop = excluded.Crop,
                 Previous-Crop = excluded.Previous-Crop,
                 Soil-Test-P = excluded.Soil-Test-P,
                 Soil-Test-K = excluded.Soil-Test-K,
                 Regular-Manure = excluded.Regular-Manure,
                 Recent-Grass = excluded.Recent-Grass,
                 Size = excluded.Size
            `,
                    [
                        field.farmId,
                        field.key,
                        field.name,
                        JSON.stringify(field.fieldCoordinates),
                        field.soilType,
                        field.cropType,
                        field.prevCropType,
                        field.soilTestP,
                        field.soilTestK,
                        field.organicManure,
                        field.recentGrass,
                        field.area
                    ]
                )
            )
            .then(([results]) =>
                console.log(
                    `[db] Field "${field.name}" created successfully with id:
           ${results.insertId}`
                )
            );
    }
    public deleteField(field: Field): Promise<void> {}

    public getSpreadEvents(field: Field): Promise<Array<SpreadEvent>> {}
    public getSpreadEvent(id: number): Promise<SpreadEvent> {}
    public saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}
    public deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}

    public getManures(): Promise<Array<Manure>> {}
    public saveManure(manure: Manure): Promise<void> {}
    public deleteManure(manure: Manure): Promise<void> {}

    private getDatabase(): Promise<SQLite.SQLiteDatabase> {
        if (this.database !== undefined) {
            return Promise.resolve(this.database);
        }
        // otherwise: open the database first
        return this.open();
    }
}

// Export a single instance of DatabaseImpl
export const database: Database = new DatabaseImpl();
