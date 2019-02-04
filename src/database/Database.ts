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

    // getFarms(): Promise<Array<Farm>>;
    // getFarm(id: number): Promise<Farm>;
    // saveFarm(farm: Farm): Promise<void>;
    //  deleteFarm(farm: Farm): Promise<void>;

    getFields(farm: Farm): Promise<Array<Field>>;
    getField(id: string): Promise<Field>;
    saveField(field: Field): Promise<void>;
    //   deleteField(field: Field): Promise<void>;

    //   getSpreadEvents(field: Field): Promise<Array<SpreadEvent>>;
    //   getSpreadEvent(id: number): Promise<SpreadEvent>;
    //   saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void>;
    //   deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void>;

    //   getManures(): Promise<Array<Manure>>;
    //   saveManure(manure: Manure): Promise<void>;
    //   deleteManure(manure: Manure): Promise<void>;

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

    //  public getFarms(): Promise<Array<Farm>> {  }
    //  public getFarm(id: number): Promise<Farm> {}
    //  public saveFarm(farm: Farm): Promise<void> {}
    //  public deleteFarm(farm: Farm): Promise<void> {}

    public getFields(farm: Farm): Promise<Array<Field>> {
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT FieldId, FarmId, "Field-Unique-Id", Name, Coordinates, Soil, Crop, "Previous-Crop"
            , "Soil-Test-P", "Soil-Test-K", "Regular-Manure", "Recent-Grass", Size FROM Field`
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return [];
                    }
                    const count = results.rows.length;
                    const fields: Field[] = [];
                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);

                        const newField = new Field();
                        newField.fieldId = row.FieldId;
                        newField.farmKey = row.FarmId;
                        newField.key = row["Field-Unique-Id"];
                        newField.name = row.Name;
                        newField.fieldCoordinates = JSON.parse(row.Coordinates);
                        newField.soilType = row.Soil;
                        newField.cropType = row.Crop;
                        newField.prevCropType = row["Previous-Crop"];
                        newField.soilTestP = row["Soil-Test-P"];
                        newField.soilTestK = row["Soil-Test-K"];
                        newField.organicManure = row["Regular-Manure"];
                        newField.recentGrass = row["Recent-Grass"];
                        newField.area = row.Size;

                        fields.push(newField);
                    }
                    return fields;
                })
        );
    }

    public getField(id: string): Promise<Field> {
        if (id === undefined) {
            return Promise.resolve(new Field());
        }
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT FieldId, FarmId, "Field-Unique-Id", Name, Coordinates, Soil, Crop, "Previous-Crop"
                    , "Soil-Test-P", "Soil-Test-K", "Regular-Manure", "Recent-Grass", Size FROM Field
                 WHERE "Field-Unique-Id" = ?`,
                    [id]
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return new Field();
                    }

                    const count = results.rows.length;
                    const field: Field = new Field();

                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);
                        field.fieldId = row.FieldId;
                        field.farmKey = row.FarmId;
                        field.key = row["Field-Unique-Id"];
                        field.name = row.Name;
                        field.fieldCoordinates = JSON.parse(row.Coordinates);
                        field.soilType = row.Soil;
                        field.cropType = row.Crop;
                        field.prevCropType = row["Previous-Crop"];
                        field.soilTestP = row["Soil-Test-P"];
                        field.soilTestK = row["Soil-Test-K"];
                        field.organicManure = row["Regular-Manure"];
                        field.recentGrass = row["Recent-Grass"];
                        field.area = row.Size;
                    }
                    return field;
                })
        );
    }

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
                    `Insert or Ignore Into Field (
                        FarmId,
                        "Field-Unique-Id",
                        Name,
                        Coordinates,
                        Soil,
                        Crop,
                        "Previous-Crop",
                        "Soil-Test-P",
                        "Soil-Test-K",
                        "Regular-Manure",
                        "Recent-Grass",
                        Size) values(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12);
                        UPDATE Field SET
                        FarmId = ?1,
                        Name = ?3,
                        Coordinates= ?4,
                        Soil= ?5,
                        Crop= ?6,
                        "Previous-Crop"= ?7,
                        "Soil-Test-P"= ?8,
                        "Soil-Test-K"= ?9,
                        "Regular-Manure"= ?10,
                        "Recent-Grass"= ?11,
                        Size= ?12
                        where changes() = 0 and "Field-Unique-Id" = ?2;
                        `,

                    [
                        field.farmKey,
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
                    `[db] Field "${field.name}" created successfully with id: ${
                        results.insertId
                    }`
                )
            );
    }
    //    public deleteField(field: Field): Promise<void> {}

    //   public getSpreadEvents(field: Field): Promise<Array<SpreadEvent>> {}
    //   public getSpreadEvent(id: number): Promise<SpreadEvent> {}
    //   public saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}
    //   public deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}

    //   public getManures(): Promise<Array<Manure>> {}
    //   public saveManure(manure: Manure): Promise<void> {}
    //   public deleteManure(manure: Manure): Promise<void> {}

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
