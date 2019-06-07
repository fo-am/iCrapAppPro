/**
 * React Native SQLite Demo
 * Copyright (c) 2018 Bruce Lefebvre <bruce@brucelefebvre.com>
 * https://github.com/blefebvre/react-native-sqlite-demo/blob/master/LICENSE
 */
import SQLite from "react-native-sqlite-storage";
import { DatabaseInitialization } from "./DatabaseInit";

import AppSettings from "../model/appSettings";
import Coords from "../model/Coords";
import Farm from "../model/Farm";
import Field from "../model/field";
import LatLng from "../model/LatLng";
import Manure from "../model/manure";
import SpreadEvent from "../model/spreadEvent";

import {
    Coord as ExportCoord,
    CrapAppExport,
    Event as ExportSpread,
    Farm as ExportFarm,
    Field as ExportField
} from "../Export/exportModel";

import moment from "moment";
// import settingsStore from "../store/settingsStore";

export interface Database {
    open(): Promise<SQLite.SQLiteDatabase>;
    close(): Promise<void>;

    getFarms(): Promise<Array<Farm>>;
    getFarm(key: string): Promise<Farm>;
    saveFarm(farm: Farm): Promise<void>;
    //  deleteFarm(farm: Farm): Promise<void>;

    getFields(farmKey: string): Promise<Array<Field>>;
    getField(id: string): Promise<Field>;
    saveField(field: Field): Promise<void>;
    //   deleteField(field: Field): Promise<void>;

    getSpreadEvents(fieldKey: string): Promise<Array<SpreadEvent>>;
    getSpreadEvent(spreadKey: string): Promise<SpreadEvent>;
    saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void>;
    //   deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void>;

    getManures(): Promise<Array<Manure>>;
    getManure(key: string): Promise<Manure>;
    saveManure(manure: Manure): Promise<void>;
    deleteManure(manure: Manure): Promise<void>;

    getAppSettings(): Promise<AppSettings>;
    saveAppSettings(appSettings: AppSettings): Promise<void>;

    getCSVData(): Promise<Array<Array<string>>>;

    graphData(fieldKey: string): Promise<any>;

    exportFarm(farmKey: string): Promise<CrapAppExport>;

    importFarm(importedFarm: CrapAppExport): Promise<Array<string>>;

    delete(): Promise<void>;
}

class DatabaseImpl implements Database {
    private databaseName = "CrapAppDatabase.db";
    private database: SQLite.SQLiteDatabase | undefined;

    // Open the connection to the database
    public async open(): Promise<SQLite.SQLiteDatabase> {
        SQLite.DEBUG(true);
        SQLite.enablePromise(true);
        let databaseInstance: SQLite.SQLiteDatabase;

        return SQLite.openDatabase({
            name: this.databaseName,
            location: "Library"
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
    // delete all the things
    public async delete(): Promise<void> {
        this.getDatabase().then(db => {
            db.executeSql("DROP TABLE IF EXISTS Farm;");
            db.executeSql("DROP TABLE IF EXISTS Field;");
            db.executeSql("DROP TABLE IF EXISTS SpreadEvent;");
            db.executeSql("DROP TABLE IF EXISTS Manure;");
            db.executeSql("DROP TABLE IF EXISTS AppSettings;");
            db.executeSql("DROP TABLE IF EXISTS Version;");
        });

        return this.close();
    }

    public getFarms(): Promise<Array<Farm>> {
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT  "Farm-Unique-Id", "Latitude", "Longitude",  "Name",   "Rainfall",
                    "Cost-N", "Cost-P", "Cost-K", "Cost-S", "Cost-Mg"
                     FROM Farm WHERE "Deleted" != 1`
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return [];
                    }
                    const count = results.rows.length;
                    const farms: Farm[] = [];
                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);

                        const farm = new Farm();

                        farm.key = row["Farm-Unique-Id"];
                        farm.farmLocation.latitude = row.Latitude;
                        farm.farmLocation.longitude = row.Longitude;
                        farm.name = row.Name;
                        farm.rainfall = row.Rainfall;
                        farm.costN = row["Cost-N"];
                        farm.costP = row["Cost-P"];
                        farm.costK = row["Cost-K"];
                        farm.costS = row["Cost-S"];
                        farm.costMg = row["Cost-Mg"];

                        farms.push(farm);
                    }
                    return farms.reverse();
                })
        );
    }
    public getFarm(key: string): Promise<Farm> {
        if (key === undefined) {
            return Promise.resolve(new Farm());
        }
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT  "Farm-Unique-Id", "Latitude", "Longitude",  "Name",   "Rainfall",
                    "Cost-N", "Cost-P", "Cost-K", "Cost-S", "Cost-Mg"
                     FROM Farm
             WHERE "Farm-Unique-Id" = ?`,
                    [key]
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return new Farm();
                    }

                    const count = results.rows.length;
                    const farm: Farm = new Farm();

                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);

                        farm.key = row["Farm-Unique-Id"];
                        farm.farmLocation.latitude = row.Latitude;
                        farm.farmLocation.longitude = row.Longitude;
                        farm.name = row.Name;
                        farm.rainfall = row.Rainfall;
                        farm.costN = row["Cost-N"];
                        farm.costP = row["Cost-P"];
                        farm.costK = row["Cost-K"];
                        farm.costS = row["Cost-S"];
                        farm.costMg = row["Cost-Mg"];
                    }
                    return farm;
                })
        );
    }

    public async saveFarm(farm: Farm): Promise<void> {
        // look in database to see if we have this ID
        // if so then update with the values here
        // else add a new record
        if (farm === undefined) {
            return Promise.reject(Error("Could not null farm"));
        }
        // https://www.sqlite.org/lang_UPSERT.html but current sqlite version cannot handle it so
        //
        let dbCount: number = 0;
        await this.getDatabase()
            .then(db =>
                db.executeSql(
                    'select count(1) as count from Farm where "Farm-Unique-Id" = ?',
                    [farm.key]
                )
            )
            .then(([result]) => {
                const count = result.rows.length;
                for (let i = 0; i < count; i++) {
                    const row = result.rows.item(i);
                    dbCount = row.count;
                }
            });

        if (dbCount === 1) {
            // update
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `
                        UPDATE Farm SET
                        Latitude = ?2,
                        Longitude = ?3,
                        Name= ?4,
                        Rainfall= ?5,
                        "Cost-N" = ?6,
                        "Cost-P"= ?7,
                        "Cost-K"= ?8,
                        "Cost-S"= ?9,
                        "Cost-Mg"= ?10,
                        "Deleted" = ?11
                        where "Farm-Unique-Id" = ?1;
                        `,

                        [
                            farm.key,
                            farm.farmLocation.latitude,
                            farm.farmLocation.longitude,
                            farm.name,
                            farm.rainfall,
                            farm.costN,
                            farm.costP,
                            farm.costK,
                            farm.costS,
                            farm.costMg,
                            0
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] Farm "${
                            farm.name
                        }" updated successfully rows affected: ${
                            results.rowsAffected
                        }`
                    )
                );
        } else {
            // insert
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `Insert  Into Farm (
                            "Farm-Unique-Id",
                            Latitude ,
                            Longitude,
                            Name,
                            Rainfall,
                            "Cost-N",
                            "Cost-P",
                            "Cost-K",
                            "Cost-S",
                            "Cost-Mg",
                            Deleted
                           ) values(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11);
                        `,

                        [
                            farm.key,
                            farm.farmLocation.latitude,
                            farm.farmLocation.longitude,
                            farm.name,
                            farm.rainfall,
                            farm.costN,
                            farm.costP,
                            farm.costK,
                            farm.costS,
                            farm.costMg,
                            0
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] Farm "${
                            farm.name
                        }" inserted successfully rows affected: ${
                            results.rowsAffected
                        }`
                    )
                );
        }
    }
    //  public deleteFarm(farm: Farm): Promise<void> {}

    public getFields(farmKey: string): Promise<Array<Field>> {
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT "Field-Unique-Id", "FarmKey", Name, Coordinates, Soil, Crop, "Previous-Crop"
            , "Soil-Test-P", "Soil-Test-K","Soil-Test-Mg", "Regular-Manure", "Recent-Grass", Size
             FROM Field where FarmKey = ? AND "Deleted" != 1`,
                    [farmKey]
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
                        newField.key = row["Field-Unique-Id"];
                        newField.farmKey = row.FarmKey;
                        newField.name = row.Name;
                        newField.fieldCoordinates = JSON.parse(row.Coordinates);
                        newField.soilType = row.Soil;
                        newField.cropType = JSON.parse(row.Crop);
                        newField.prevCropType = row["Previous-Crop"];
                        newField.soilTestP = row["Soil-Test-P"];
                        newField.soilTestK = row["Soil-Test-K"];
                        newField.soilTestMg = row["Soil-Test-Mg"];
                        newField.organicManure = row["Regular-Manure"];
                        newField.recentGrass = row["Recent-Grass"];
                        newField.area = row.Size;

                        fields.push(newField);
                    }
                    return fields;
                })
        );
    }

    public getField(key: string): Promise<Field> {
        if (key === undefined) {
            return Promise.resolve(new Field());
        }
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT  "Field-Unique-Id", FarmKey, Name, Coordinates, Soil, Crop, "Previous-Crop"
                    , "Soil-Test-P", "Soil-Test-K", "Soil-Test-Mg", "Regular-Manure", "Recent-Grass", Size FROM Field
                 WHERE "Field-Unique-Id" = ?`,
                    [key]
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return new Field();
                    }

                    const count = results.rows.length;
                    const field: Field = new Field();

                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);
                        field.key = row["Field-Unique-Id"];
                        field.farmKey = row.FarmKey;
                        field.name = row.Name;
                        field.fieldCoordinates = JSON.parse(row.Coordinates);
                        field.soilType = row.Soil;
                        field.cropType = JSON.parse(row.Crop);
                        field.prevCropType = row["Previous-Crop"];
                        field.soilTestP = row["Soil-Test-P"];
                        field.soilTestK = row["Soil-Test-K"];
                        field.soilTestMg = row["Soil-Test-Mg"];
                        field.organicManure = row["Regular-Manure"];
                        field.recentGrass = row["Recent-Grass"];
                        field.area = row.Size;
                    }
                    return field;
                })
        );
    }

    public async saveField(field: Field): Promise<void> {
        // look in database to see if we have this ID
        // if so then update with the values here
        // else add a new record
        if (field === undefined) {
            return Promise.reject(
                Error("Could not add item to undefined list.")
            );
        }
        // https://www.sqlite.org/lang_UPSERT.html but current sqlite version cannot handle it so
        //
        let dbCount: number = 0;
        await this.getDatabase()
            .then(db =>
                db.executeSql(
                    'select count(1) as count from Field where "Field-Unique-Id" = ?',
                    [field.key]
                )
            )
            .then(([result]) => {
                const count = result.rows.length;
                for (let i = 0; i < count; i++) {
                    const row = result.rows.item(i);
                    dbCount = row.count;
                }
            });

        if (dbCount === 1) {
            // update
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `
                        UPDATE Field SET
                        FarmKey = ?2,
                        Name = ?3,
                        Coordinates= ?4,
                        Soil= ?5,
                        Crop= ?6,
                        "Previous-Crop"= ?7,
                        "Soil-Test-P"= ?8,
                        "Soil-Test-K"= ?9,
                        "Soil-Test-Mg"= ?10,
                        "Regular-Manure"= ?11,
                        "Recent-Grass"= ?12,
                        Size = ?13,
                        "Deleted" = ?14
                        where "Field-Unique-Id" = ?1;
                        `,

                        [
                            field.key,
                            field.farmKey,
                            field.name,
                            JSON.stringify(field.fieldCoordinates),
                            field.soilType,
                            JSON.stringify(field.cropType),
                            field.prevCropType,
                            field.soilTestP,
                            field.soilTestK,
                            field.soilTestMg,
                            field.organicManure,
                            field.recentGrass,
                            field.area,
                            0
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] Field "${
                            field.name
                        }" updated successfully rows affected: ${
                            results.rowsAffected
                        }`
                    )
                );
        } else {
            // insert
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `Insert Into Field (
                        "Field-Unique-Id",
                        FarmKey,
                        Name,
                        Coordinates,
                        Soil,
                        Crop,
                        "Previous-Crop",
                        "Soil-Test-P",
                        "Soil-Test-K",
                        "Soil-Test-Mg",
                        "Regular-Manure",
                        "Recent-Grass",
                        Size,
                        "Deleted"
                        )
                        values(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14);
                        `,

                        [
                            field.key,
                            field.farmKey,
                            field.name,
                            JSON.stringify(field.fieldCoordinates),
                            field.soilType,
                            JSON.stringify(field.cropType),
                            field.prevCropType,
                            field.soilTestP,
                            field.soilTestK,
                            field.soilTestMg,
                            field.organicManure,
                            field.recentGrass,
                            field.area,
                            0
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] Field "${
                            field.name
                        }" inserted successfully rows affected: ${
                            results.rowsAffected
                        }`
                    )
                );
        }
    }
    //    public deleteField(field: Field): Promise<void> {}

    public async getSpreadEvents(
        fieldKey: string
    ): Promise<Array<SpreadEvent>> {
        if (fieldKey === undefined) {
            return Promise.resolve([]);
        }
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT
                      "SpreadEvent-Unique-Id", FieldKey,
                      "Date", "Manure-Type", "Nutrients-N", "Nutrients-P",
                     "Nutrients-K","Nutrients-S","Nutrients-Mg",
                      "Total-Nutrients-N", "Total-Nutrients-P", "Total-Nutrients-K",
                       "Total-Nutrients-S", "Total-Nutrients-Mg",
                      "Require-N", "Require-P",
                     "Require-K", "Require-S", "Require-Mg", "SNS", "Soil", "Size", "Amount",
                      "Quality", "Application", "Season", "Crop", "ImageUri"
                     FROM SpreadEvent where FieldKey = ? AND "Deleted" != 1 ORDER BY "Date" DESC`,
                    [fieldKey]
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return [];
                    }
                    const count = results.rows.length;
                    const spreadEvents: SpreadEvent[] = [];
                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);

                        const newSpreadEvent = new SpreadEvent();

                        newSpreadEvent.key = row["SpreadEvent-Unique-Id"];
                        newSpreadEvent.fieldkey = row.FieldKey;
                        newSpreadEvent.date = moment(row.Date);
                        newSpreadEvent.manureType = row["Manure-Type"];
                        newSpreadEvent.nutrientsN = this.safeNumber(
                            row["Nutrients-N"]
                        );
                        newSpreadEvent.nutrientsP = this.safeNumber(
                            row["Nutrients-P"]
                        );
                        newSpreadEvent.nutrientsK = this.safeNumber(
                            row["Nutrients-K"]
                        );
                        newSpreadEvent.nutrientsS = this.safeNumber(
                            row["Nutrients-S"]
                        );
                        newSpreadEvent.nutrientsMg = this.safeNumber(
                            row["Nutrients-Mg"]
                        );
                        newSpreadEvent.totalNutrientsN = this.safeNumber(
                            row["Total-Nutrients-N"]
                        );
                        newSpreadEvent.totalNutrientsP = this.safeNumber(
                            row["Total-Nutrients-P"]
                        );
                        newSpreadEvent.totalNutrientsK = this.safeNumber(
                            row["Total-Nutrients-K"]
                        );
                        newSpreadEvent.totalNutrientsS = this.safeNumber(
                            row["Total-Nutrients-S"]
                        );
                        newSpreadEvent.totalNutrientsMg = this.safeNumber(
                            row["Total-Nutrients-Mg"]
                        );
                        newSpreadEvent.requireN = this.safeNumber(
                            row["Require-N"]
                        );
                        newSpreadEvent.requireP = this.safeNumber(
                            row["Require-P"]
                        );
                        newSpreadEvent.requireK = this.safeNumber(
                            row["Require-K"]
                        );
                        newSpreadEvent.requireS = this.safeNumber(
                            row["Require-S"]
                        );
                        newSpreadEvent.requireMg = this.safeNumber(
                            row["Require-Mg"]
                        );
                        newSpreadEvent.sns = row.SNS;
                        newSpreadEvent.soil = row.Soil;
                        newSpreadEvent.size = row.Size;
                        newSpreadEvent.amount = row.Amount;
                        newSpreadEvent.quality = row.Quality;
                        newSpreadEvent.applicationType = row.Application;
                        newSpreadEvent.season = row.Season;
                        newSpreadEvent.crop = JSON.parse(row.Crop);
                        newSpreadEvent.imagePath = row.ImageUri;

                        spreadEvents.push(newSpreadEvent);
                    }
                    return spreadEvents;
                })
        );
    }
    public getSpreadEvent(spreadKey: string): Promise<SpreadEvent> {
        if (spreadKey === undefined) {
            return Promise.resolve(new SpreadEvent());
        }
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `SELECT
                  "SpreadEvent-Unique-Id", FieldKey,
                  "Date", "Manure-Type", "Nutrients-N", "Nutrients-P",
                 "Nutrients-K", "Nutrients-S", "Nutrients-Mg",
                 "Total-Nutrients-N", "Total-Nutrients-P", "Total-Nutrients-K",
                 "Total-Nutrients-S", "Total-Nutrients-Mg",
                 "Require-N", "Require-P",
                 "Require-K", "Require-S", "Require-Mg", "SNS", "Soil", "Size", "Amount",
                  "Quality", "Application", "Season", "Crop", "ImageUri"
                 FROM SpreadEvent where "SpreadEvent-Unique-Id" = ?`,
                    [spreadKey]
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return new SpreadEvent();
                    }
                    const count = results.rows.length;
                    const newSpreadEvent: SpreadEvent = new SpreadEvent();
                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);

                        newSpreadEvent.key = row["SpreadEvent-Unique-Id"];
                        newSpreadEvent.fieldkey = row.FieldKey;
                        newSpreadEvent.date = moment(row.Date);
                        newSpreadEvent.manureType = row["Manure-Type"];
                        newSpreadEvent.nutrientsN = this.safeNumber(
                            row["Nutrients-N"]
                        );
                        newSpreadEvent.nutrientsP = this.safeNumber(
                            row["Nutrients-P"]
                        );
                        newSpreadEvent.nutrientsK = this.safeNumber(
                            row["Nutrients-K"]
                        );
                        newSpreadEvent.nutrientsS = this.safeNumber(
                            row["Nutrients-S"]
                        );
                        newSpreadEvent.nutrientsMg = this.safeNumber(
                            row["Nutrients-Mg"]
                        );
                        newSpreadEvent.totalNutrientsN = this.safeNumber(
                            row["Total-Nutrients-N"]
                        );
                        newSpreadEvent.totalNutrientsP = this.safeNumber(
                            row["Total-Nutrients-P"]
                        );
                        newSpreadEvent.totalNutrientsK = this.safeNumber(
                            row["Total-Nutrients-K"]
                        );
                        newSpreadEvent.totalNutrientsS = this.safeNumber(
                            row["Total-Nutrients-S"]
                        );
                        newSpreadEvent.totalNutrientsMg = this.safeNumber(
                            row["Total-Nutrients-Mg"]
                        );
                        newSpreadEvent.requireN = this.safeNumber(
                            row["Require-N"]
                        );
                        newSpreadEvent.requireP = this.safeNumber(
                            row["Require-P"]
                        );
                        newSpreadEvent.requireK = this.safeNumber(
                            row["Require-K"]
                        );
                        newSpreadEvent.requireS = this.safeNumber(
                            row["Require-S"]
                        );
                        newSpreadEvent.requireMg = this.safeNumber(
                            row["Require-Mg"]
                        );
                        newSpreadEvent.sns = row.SNS;
                        newSpreadEvent.soil = row.Soil;
                        newSpreadEvent.size = row.Size;
                        newSpreadEvent.amount = row.Amount;
                        newSpreadEvent.quality = row.Quality;
                        newSpreadEvent.applicationType = row.Application;
                        newSpreadEvent.season = row.Season;
                        newSpreadEvent.crop = JSON.parse(row.Crop);
                        newSpreadEvent.imagePath = row.ImageUri;
                    }
                    return newSpreadEvent;
                })
        );
    }
    public async saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {
        if (spreadEvent === undefined) {
            return Promise.reject(Error("spreadEvent not supplied."));
        }
        // https://www.sqlite.org/lang_UPSERT.html but current sqlite version cannot handle it so
        //
        let dbCount: number = 0;
        await this.getDatabase()
            .then(db =>
                db.executeSql(
                    'select count(1) as count from SpreadEvent where "SpreadEvent-Unique-Id" = ?',
                    [spreadEvent.key]
                )
            )
            .then(([result]) => {
                const count = result.rows.length;
                for (let i = 0; i < count; i++) {
                    const row = result.rows.item(i);
                    dbCount = row.count;
                }
            });

        if (dbCount === 1) {
            // update
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `UPDATE SpreadEvent SET
                        "FieldKey" = ?2,
                        "Manure-Type" =?3,
                        "Date"= ?4,
                        "Quality"= ?5,
                        "Application"= ?6,
                        "Amount"= ?7,
                        "Nutrients-N"= ?8,
                        "Nutrients-P"= ?9,
                        "Nutrients-K"= ?10,
                        "Nutrients-S"= ?11,
                        "Nutrients-Mg"= ?12,
                        "Total-Nutrients-N" = ?13,
                        "Total-Nutrients-P" = ?14,
                        "Total-Nutrients-K" = ?15,
                        "Total-Nutrients-S" = ?16,
                        "Total-Nutrients-Mg" = ?17,
                        "Require-N"= ?18,
                        "Require-P"= ?19,
                        "Require-K"= ?20,
                        "Require-S"= ?21,
                        "Require-Mg"= ?22,
                        "SNS"= ?23,
                        "Soil"= ?24,
                        "Size"= ?25,
                        "Season"= ?26,
                        "Crop"= ?27,
                        "ImageUri" = ?28
                         WHERE  "SpreadEvent-Unique-Id" = ?1;`,
                        [
                            spreadEvent.key,
                            spreadEvent.fieldkey,
                            spreadEvent.manureType,
                            spreadEvent.date.toISOString(),
                            spreadEvent.quality,
                            spreadEvent.applicationType,
                            spreadEvent.amount,
                            this.safeNumber(spreadEvent.nutrientsN),
                            this.safeNumber(spreadEvent.nutrientsP),
                            this.safeNumber(spreadEvent.nutrientsK),
                            this.safeNumber(spreadEvent.nutrientsS),
                            this.safeNumber(spreadEvent.nutrientsMg),
                            this.safeNumber(spreadEvent.totalNutrientsN),
                            this.safeNumber(spreadEvent.totalNutrientsP),
                            this.safeNumber(spreadEvent.totalNutrientsK),
                            this.safeNumber(spreadEvent.totalNutrientsS),
                            this.safeNumber(spreadEvent.totalNutrientsMg),
                            this.safeNumber(spreadEvent.requireN),
                            this.safeNumber(spreadEvent.requireP),
                            this.safeNumber(spreadEvent.requireK),
                            this.safeNumber(spreadEvent.requireS),
                            this.safeNumber(spreadEvent.requireMg),
                            spreadEvent.sns,
                            spreadEvent.soil,
                            spreadEvent.size,
                            spreadEvent.season,
                            JSON.stringify(spreadEvent.crop),
                            spreadEvent.imagePath
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] SpreadEvent "${
                            spreadEvent.date
                        }" updated successfully`
                    )
                );
        } else {
            // insert
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `Insert Into SpreadEvent (
                        "SpreadEvent-Unique-Id",
                        "FieldKey",
                        "Manure-Type",
                        "Date",
                        "Quality",
                        "Application",
                        "Amount",
                        "Nutrients-N",
                        "Nutrients-P",
                        "Nutrients-K",
                        "Nutrients-S",
                        "Nutrients-Mg",
                        "Total-Nutrients-N",
                        "Total-Nutrients-P",
                        "Total-Nutrients-K",
                        "Total-Nutrients-S",
                        "Total-Nutrients-Mg",
                        "Require-N",
                        "Require-P",
                        "Require-K",
                        "Require-S",
                        "Require-Mg",
                        "SNS",
                        "Soil",
                        "Size",
                         "Season",
                        "Crop",
                        "ImageUri",
                        "Deleted")
                         VALUES
                         (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20,?21,?22,?23
                            ,?24,?25,?26,?27,?28,?29);`,
                        [
                            spreadEvent.key,
                            spreadEvent.fieldkey,
                            spreadEvent.manureType,
                            spreadEvent.date.toISOString(),
                            spreadEvent.quality,
                            spreadEvent.applicationType,
                            spreadEvent.amount,
                            this.safeNumber(spreadEvent.nutrientsN),
                            this.safeNumber(spreadEvent.nutrientsP),
                            this.safeNumber(spreadEvent.nutrientsK),
                            this.safeNumber(spreadEvent.nutrientsS),
                            this.safeNumber(spreadEvent.nutrientsMg),
                            this.safeNumber(spreadEvent.totalNutrientsN),
                            this.safeNumber(spreadEvent.totalNutrientsP),
                            this.safeNumber(spreadEvent.totalNutrientsK),
                            this.safeNumber(spreadEvent.totalNutrientsS),
                            this.safeNumber(spreadEvent.totalNutrientsMg),
                            this.safeNumber(spreadEvent.requireN),
                            this.safeNumber(spreadEvent.requireP),
                            this.safeNumber(spreadEvent.requireK),
                            this.safeNumber(spreadEvent.requireS),
                            this.safeNumber(spreadEvent.requireMg),
                            spreadEvent.sns,
                            spreadEvent.soil,
                            spreadEvent.size,
                            spreadEvent.season,
                            JSON.stringify(spreadEvent.crop),
                            spreadEvent.imagePath,
                            0
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] SpreadEvent "${
                            spreadEvent.date
                        }" created successfully with id: ${results.insertId}`
                    )
                );
        }
    }
    //   public deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}

    public getManures(): Promise<Array<Manure>> {
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    'SELECT "Manure-Unique-Id" , Name, N, P, K, S, Mg FROM Manure WHERE "Deleted" != 1'
                )
                .then(([results]) => {
                    if (results === undefined) {
                        return [];
                    }
                    const count = results.rows.length;
                    const manures: Manure[] = [];
                    for (let i = 0; i < count; i++) {
                        const row = results.rows.item(i);

                        const newManure = new Manure();
                        newManure.key = row["Manure-Unique-Id"];
                        newManure.name = row.Name;
                        newManure.N = row.N;
                        newManure.P = row.P;
                        newManure.K = row.K;
                        newManure.S = row.S;
                        newManure.Mg = row.Mg;

                        manures.push(newManure);
                    }
                    return manures;
                })
        );
    }
    public getManure(key: string): Promise<Manure> {
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `Select "Manure-Unique-Id", Name, N, P, K, S, Mg, Type
                     from Manure Where  "Manure-Unique-Id" = ? `,
                    [key]
                )
                .then(([result]) => {
                    const count = result.rows.length;
                    const newManure = new Manure();

                    for (let i = 0; i < count; i++) {
                        const row = result.rows.item(i);

                        newManure.key = key;
                        newManure.name = row.Name;
                        newManure.N = row.N;
                        newManure.P = row.P;
                        newManure.K = row.K;
                        newManure.S = row.S;
                        newManure.Mg = row.Mg;
                        newManure.Type = row.Type;
                    }
                    return newManure;
                })
        );
    }

    public async saveManure(manure: Manure): Promise<void> {
        // look in database to see if we have this ID
        // if so then update with the values here
        // else add a new record
        if (manure === undefined) {
            return Promise.reject(Error("Could not add undefined manure."));
        }
        // https://www.sqlite.org/lang_UPSERT.html but current sqlite version cannot handle it so
        //
        let dbCount: number = 0;
        await this.getDatabase()
            .then(db =>
                db.executeSql(
                    'select count(1) as count from Manure where "Manure-Unique-Id" = ?',
                    [manure.key]
                )
            )
            .then(([result]) => {
                const count = result.rows.length;
                for (let i = 0; i < count; i++) {
                    const row = result.rows.item(i);
                    dbCount = row.count;
                }
            });

        if (dbCount === 1) {
            // update
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `
                        UPDATE Manure SET
                        Name = ?2,
                        N = ?3,
                        P = ?4,
                        K = ?5,
                        S = ?6,
                        Mg = ?7,
                        Type = ?8
                        WHERE "Manure-Unique-Id" = ?1;
                        `,

                        [
                            manure.key,
                            manure.name,
                            manure.N,
                            manure.P,
                            manure.K,
                            manure.S,
                            manure.Mg,
                            manure.Type
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] Field "${manure.name}" updated successfully.`
                    )
                );
        } else {
            // insert
            return this.getDatabase()
                .then(db =>
                    db.executeSql(
                        `
                        Insert into Manure ("Manure-Unique-Id", Name, N, P, K, S, Mg, Type)
                        VALUES
                        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8);
                        `,

                        [
                            manure.key,
                            manure.name,
                            manure.N,
                            manure.P,
                            manure.K,
                            manure.S,
                            manure.Mg,
                            manure.Type
                        ]
                    )
                )
                .then(([results]) =>
                    console.log(
                        `[db] Manure "${
                            manure.name
                        }" inserted successfully rows affected: ${
                            results.rowsAffected
                        }`
                    )
                );
        }
    }
    public async deleteManure(manure: Manure): Promise<void> {
        return this.getDatabase()
            .then(db =>
                db.executeSql(
                    'Update manure set "Deleted" = 1 where "Manure-Unique-Id" = ?;',
                    [manure.key]
                )
            )
            .then(([res]) =>
                console.log(
                    `[db] Manure "${
                        manure.name
                    }" deleted successfully rows affected: ${res.rowsAffected}`
                )
            );
    }

    public async getAppSettings(): Promise<AppSettings> {
        return this.getDatabase().then(db =>
            db
                .executeSql("select Email,Units from AppSettings")
                .then(([res]) => {
                    if (res === undefined) {
                        return new AppSettings();
                    }
                    const count = res.rows.length;
                    const appSettings: AppSettings = new AppSettings();

                    for (let i = 0; i < count; i++) {
                        const row = res.rows.item(i);

                        appSettings.email = row.Email;
                        appSettings.unit = row.Units;
                    }
                    return appSettings;
                })
        );
    }

    public saveAppSettings(appSettings: AppSettings): Promise<void> {
        return this.getDatabase().then(db => {
            db.executeSql("delete from AppSettings;");
            db.executeSql(
                'insert into AppSettings (Email, Units, "User-Id", Language) values (?, ?, "AndroidUser", "en-gb")',
                [appSettings.email, appSettings.unit]
            );
        });
    }
    public async getCSVData(): Promise<Array<Array<string>>> {
        return this.getDatabase()
            .then(db =>
                db.executeSql(`
            select fa.name as farmName, fi.name as fieldName, s."Manure-Type" ,s.date,
             s."Nutrients-N", s."Nutrients-P", s."Nutrients-K\", s."Nutrients-S\",s."Nutrients-Mg\",
            s.\`Require-N\`,s.\`Require-P\`,s.\`Require-K\`, s.\`Require-S\`, s.\`Require-Mg\`,
            s.SNS,s.Soil,s.Size, s.Amount ,s.Quality,s.Application,
            s.Season,s.Crop
            from SpreadEvent  s
            join Field fi on fi.\`Field-Unique-Id\` = s.FieldKey
            join Farm fa on fa.\`Farm-Unique-Id\` = fi.FarmKey
            `)
            )
            .then(([res]) => {
                const count = res.rows.length;
                const results: Array<Array<string>> = new Array<
                    Array<string>
                >();

                for (let i = 0; i < count; i++) {
                    const rowArray: Array<string> = [];
                    const row = res.rows.item(i);

                    // need to translate these!
                    rowArray.push(row.farmName);
                    rowArray.push(row.fieldName);
                    rowArray.push(row["Manure-Type"]);
                    rowArray.push(row.Date);
                    rowArray.push(this.safeNumber(row["Nutrients-N"]));
                    rowArray.push(this.safeNumber(row["Nutrients-P"]));
                    rowArray.push(this.safeNumber(row["Nutrients-K"]));
                    rowArray.push(this.safeNumber(row["Nutrients-S"]));
                    rowArray.push(this.safeNumber(row["Nutrients-Mg"]));
                    rowArray.push(this.safeNumber(row["Require-N"]));
                    rowArray.push(this.safeNumber(row["Require-P"]));
                    rowArray.push(this.safeNumber(row["Require-K"]));
                    rowArray.push(this.safeNumber(row["Require-S"]));
                    rowArray.push(this.safeNumber(row["Require-Mg"]));
                    rowArray.push(row.SNS);
                    rowArray.push(row.Soil);
                    rowArray.push(row.Size);
                    rowArray.push(row.Amount);
                    rowArray.push(row.Quality);
                    rowArray.push(row.Application);
                    rowArray.push(row.Season);
                    rowArray.push(row.Crop);

                    results.push(rowArray);
                }
                return results;
            });
    }

    public async importFarm(farm: CrapAppExport): Promise<Array<string>> {
        const results: Array<string> = [];
        // does this farm exist?
        //    return this.getDatabase().then (db => db.)

        const importFarm: ExportFarm = farm.farm;

        const farmImport: Farm = new Farm();

        farmImport.key = importFarm.unique_id;
        farmImport.name = importFarm.name;
        farmImport.rainfall = importFarm.rainfall;
        farmImport.costN = importFarm.cost_n;
        farmImport.costP = importFarm.cost_p;
        farmImport.costK = importFarm.cost_k;
        farmImport.costS = importFarm.cost_s;
        farmImport.costMg = importFarm.cost_m;
        farmImport.farmLocation = this.getAvgFieldLocation(importFarm.fields);

        this.saveFarm(farmImport);
        results.push(`Farm ${farm.farm.name} added`);

        if (farm.farm.fields) {
            for (const field of farm.farm.fields) {
                const fieldImport: Field = new Field();

                fieldImport.farmKey = importFarm.unique_id;
                fieldImport.key = field.unique_id;
                fieldImport.name = field.name;
                fieldImport.cropType = JSON.parse(field.crop);
                fieldImport.organicManure = field.regularly_manure;
                fieldImport.prevCropType = field.previous_crop;
                fieldImport.recentGrass = field.recently_grown_grass;
                fieldImport.soilTestK = field.soil_test_k;
                fieldImport.soilTestMg = field.soil_test_m;
                fieldImport.soilTestP = field.soil_test_p;
                fieldImport.soilType = field.soil;
                fieldImport.fieldCoordinates = this.GetFieldCoords(
                    field.coords
                );
                fieldImport.area = field.size;

                this.saveField(fieldImport);
                results.push(`Field ${field.name} added`);

                this.saveSpreadEvents(field.events, field.unique_id);
                results.push(`${field.events.length} spread events added`);
            }
        }
        return results;
    }
    public saveSpreadEvents(
        events: ExportSpread[] | undefined,
        fieldKey: string
    ) {
        if (events) {
            for (const event of events) {
                const spreadImport: SpreadEvent = new SpreadEvent();
                spreadImport.fieldkey = fieldKey;
                spreadImport.key = event.unique_id;
                spreadImport.manureType = event.type;
                spreadImport.amount = event.amount;
                spreadImport.quality = event.quality;
                spreadImport.season = event.season;
                spreadImport.size = event.size;
                spreadImport.sns = event.sns;
                spreadImport.soil = event.soil;
                spreadImport.nutrientsK = event.nutrients_k;
                spreadImport.nutrientsMg = event.nutrients_m;
                spreadImport.nutrientsN = event.nutrients_n;
                spreadImport.nutrientsP = event.nutrients_p;
                spreadImport.nutrientsS = event.nutrients_s;
                spreadImport.requireK = event.require_k;
                spreadImport.requireMg = event.require_m;
                spreadImport.requireN = event.require_n;
                spreadImport.requireP = event.require_p;
                spreadImport.requireS = event.require_s;
                spreadImport.totalNutrientsK = event.total_nutrients_k;
                spreadImport.totalNutrientsMg = event.total_nutrients_m;
                spreadImport.totalNutrientsN = event.total_nutrients_n;
                spreadImport.totalNutrientsP = event.total_nutrients_p;
                spreadImport.totalNutrientsS = event.total_nutrients_s;
                spreadImport.applicationType = event.application;
                spreadImport.crop = JSON.parse(event.crop);
                spreadImport.date = moment(event.date, "D/M/YYYY");

                this.saveSpreadEvent(spreadImport);
            }
        }
    }
    public async graphData(fieldKey: string): Promise<any> {
        return this.getDatabase().then(db =>
            db
                .executeSql(
                    `select date,"Nutrients-N","Nutrients-P","Nutrients-K","Nutrients-S", "Nutrients-Mg"
                    from   SpreadEvent where "FieldKey" = "${fieldKey}" and "Deleted" is not '1' order by date asc`
                )
                .then(([res]) => {
                    const count = res.rows.length;
                    const results: Array<Array<string>> = new Array<
                        Array<string>
                    >();

                    const structure = [
                        {
                            name: "N",
                            data: new Array<any>()
                        },
                        {
                            name: "P",
                            data: new Array<any>()
                        },
                        {
                            name: "K",
                            data: new Array<any>()
                        },
                        {
                            name: "S",
                            data: new Array<any>()
                        },
                        {
                            name: "Mg",
                            data: new Array<any>()
                        }
                    ];

                    for (let i = 0; i < count; i++) {
                        const row = res.rows.item(i);

                        let dataArray = new Array<any>();

                        dataArray.push(
                            Date.parse(moment(row.Date).toISOString())
                        );
                        dataArray.push(row["Nutrients-N"]);

                        structure[0].data.push(dataArray);
                        dataArray = [];

                        dataArray.push(
                            Date.parse(moment(row.Date).toISOString())
                        );
                        dataArray.push(row["Nutrients-P"]);

                        structure[1].data.push(dataArray);
                        dataArray = [];

                        dataArray.push(
                            Date.parse(moment(row.Date).toISOString())
                        );
                        dataArray.push(row["Nutrients-K"]);

                        structure[2].data.push(dataArray);
                        dataArray = [];

                        dataArray.push(
                            Date.parse(moment(row.Date).toISOString())
                        );
                        dataArray.push(row["Nutrients-S"]);

                        structure[3].data.push(dataArray);
                        dataArray = [];

                        dataArray.push(
                            Date.parse(moment(row.Date).toISOString())
                        );
                        dataArray.push(row["Nutrients-Mg"]);

                        structure[4].data.push(dataArray);
                    }
                    var a = JSON.stringify(structure);
                    return structure;
                })
        );
    }
    public async exportFarm(farmKey: string): Promise<CrapAppExport> {
        return this.getDatabase()
            .then(db =>
                db.executeSql(`select
    fa.'Farm-Unique-Id'
    ,fa.Latitude
    ,fa.Longitude
    ,fa.Name as FarmName
    ,fa.Rainfall
    ,fa.'Cost-N'
    ,fa.'Cost-P'
    ,fa.'Cost-K'
    ,fa.'Cost-S'
    ,fa.'Cost-Mg'
    ,fi.'Field-Unique-Id'
    ,fi.FarmKey
    ,fi.Name as FieldName
    ,fi.Coordinates
    ,fi.Soil
    ,fi.Crop
    ,fi.'Previous-Crop'
    ,fi.'Soil-Test-P'
    ,fi.'Soil-Test-K'
    ,fi.'Soil-Test-Mg'
    ,fi.'Regular-Manure'
    ,fi.'Recent-Grass'
    ,fi.Size
    ,se.'SpreadEvent-Unique-Id'
    ,se.FieldKey
    ,se.'Manure-Type'
    ,se.Date
    ,se.Quality
    ,se.Application
    ,se.Amount
    ,se.'Nutrients-N'
    ,se.'Nutrients-P'
    ,se.'Nutrients-K'
    ,se.'Nutrients-S'
    ,se.'Nutrients-Mg'
    ,se.'Require-N'
    ,se.'Require-P'
    ,se.'Require-K'
    ,se.'Require-S'
    ,se.'Require-Mg'
    ,se.'Total-Nutrients-N'
    ,se.'Total-Nutrients-P'
    ,se.'Total-Nutrients-K'
    ,se.'Total-Nutrients-S'
    ,se.'Total-Nutrients-Mg'
    ,se.SNS
    ,se.Season

     from Farm fa
    left join Field fi on fa.'Farm-Unique-Id' = fi.FarmKey
    left join SpreadEvent se on se.FieldKey = fi.'Field-Unique-Id'
    WHERE  fa.'Farm-Unique-Id' = "${farmKey}"
    `)
            )
            .then(([res]) => {
                const count = res.rows.length;
                const farms: Array<ExportFarm> = [];
                for (let i = 0; i < count; i++) {
                    const row = res.rows.item(i);
                    // Does this row have a farm?
                    if (row["Farm-Unique-Id"]) {
                        // yes
                        // // is the farm in the list?

                        const farmIndex = farms.findIndex(
                            c => c.unique_id === row["Farm-Unique-Id"]
                        );
                        if (farmIndex === -1) {
                            //// no
                            //// create the farm then go to the next step
                            const newFarm: ExportFarm = {
                                "app-version": "iOS 1.0 Beta 38",
                                "file-version": 1,
                                unique_id: row["Farm-Unique-Id"],
                                name: row.FarmName,
                                rainfall: row.Rainfall,
                                cost_k: row["Cost-K"],
                                cost_m: row["Cost-Mg"],
                                cost_n: row["Cost-N"],
                                cost_p: row["Cost-P"],
                                cost_s: row["Cost-S"],
                                deleted: 0,
                                fields: []
                            };

                            this.fillFields(newFarm, row);
                            farms.push(newFarm);
                        } else {
                            //// yes
                            ////// lets go to the next step
                            this.fillFields(farms[farmIndex], row);
                        }
                    }

                    // no
                    // we can do nothing here lets continue
                }

                const outThink: CrapAppExport = { farm: farms[0] };

                return outThink;
            });
    }

    private GetFieldCoords(exportCoords: ExportCoord[] | undefined): Coords {
        const returnCoords: Coords = new Coords();
        returnCoords.id = "importedIds";

        if (exportCoords) {
            for (const expCoord of exportCoords) {
                const latLng = new LatLng();
                latLng.latitude = expCoord.lat;
                latLng.longitude = expCoord.lng;
                returnCoords.coordinates.push(latLng);
            }
        }

        return returnCoords;
    }
    private getAvgFieldLocation(fields: ExportField[] | undefined): LatLng {
        const output: LatLng = new LatLng();
        try {
            output.latitude = fields[0].coords[0].lat;
            output.longitude = fields[0].coords[0].lng;
        } catch {}
        return output;
    }
    private getAvg(numbers: Array<number>) {
        const total = numbers.reduce((acc, c) => acc + c, 0);
        return (total / numbers.length) | 1;
    }
    private fillFields(farm: ExportFarm, row: any): ExportFarm {
        // has a field
        if (row["Field-Unique-Id"]) {
            // yes
            // // is the field in the list?

            const fieldIndex = farm.fields.findIndex(
                c => c.unique_id === row["Field-Unique-Id"]
            );
            if (fieldIndex === -1) {
                //// no
                //// create the farm then go to the next step
                const newField: ExportField = {
                    parent: farm.unique_id,
                    unique_id: row["Field-Unique-Id"],
                    crop: row.Crop,
                    name: row.FieldName,
                    soil: row.Soil,
                    previous_crop: row["Previous-Crop"],
                    soil_test_k: row["Soil-Test-K"],
                    soil_test_m: row["Soil-Test-Mg"],
                    soil_test_p: row["Soil-Test-P"],
                    regularly_manure: row["Regular-Manure"],
                    recently_grown_grass: row["Recent-Grass"],
                    size: row.Size,
                    coords: this.exportFieldCoords(
                        row.Coordinates,
                        row["Field-Unique-Id"]
                    ),
                    deleted: 0,
                    events: []
                };

                //   newField.fieldCoordinates = JSON.parse(row.Coordinates);

                this.fillSpread(newField, row);
                farm.fields.push(newField);
                return farm;
            } else {
                //// yes
                ////// lets go to the next step
                this.fillSpread(farm.fields[fieldIndex], row);
            }
        }
    }
    private exportFieldCoords(
        coordinates: any,
        fieldKey: string
    ): ExportCoord[] | undefined {
        const coordsObject: Coords = JSON.parse(coordinates);
        const outCoords: ExportCoord[] = [];
        for (const [index, val] of coordsObject.coordinates.entries()) {
            const expCoord: ExportCoord = {
                name: "",
                parent: fieldKey,
                order: index,
                lat: val.latitude,
                lng: val.longitude
            };
            outCoords.push(expCoord);
        }
        return outCoords;
    }
    private safeNumber(possibleNumber: number | undefined): number {
        if (possibleNumber === undefined || Number.isNaN(possibleNumber)) {
            return 0;
        }
        return possibleNumber;
    }
    private fillSpread(field: ExportField, row) {
        // has a spread
        if (row["SpreadEvent-Unique-Id"]) {
            // yes
            // // is the spread in the list?

            const spreadIndex = field.events.findIndex(
                c => c.unique_id === row["SpreadEvent-Unique-Id"]
            );
            if (spreadIndex === -1) {
                //// no
                //// create the spread event then go to the next step
                const newSpreadEvent: ExportSpread = {
                    parent: row.FieldKey,
                    unique_id: row["SpreadEvent-Unique-Id"],
                    date: moment(row.Date).format("D/M/YYYY"),
                    type: row["Manure-Type"],
                    nutrients_n: this.safeNumber(row["Nutrients-N"]),
                    nutrients_p: this.safeNumber(row["Nutrients-P"]),
                    nutrients_k: this.safeNumber(row["Nutrients-K"]),
                    nutrients_s: this.safeNumber(row["Nutrients-S"]),
                    nutrients_m: this.safeNumber(row["Nutrients-Mg"]),
                    require_n: this.safeNumber(row["Require-N"]),
                    require_p: this.safeNumber(row["Require-P"]),
                    require_k: this.safeNumber(row["Require-K"]),
                    require_s: this.safeNumber(row["Require-S"]),
                    require_m: this.safeNumber(row["Require-Mg"]),
                    total_nutrients_n: this.safeNumber(
                        row["Total-Nutrients-N"]
                    ),
                    total_nutrients_p: this.safeNumber(
                        row["Total-Nutrients-P"]
                    ),
                    total_nutrients_k: this.safeNumber(
                        row["Total-Nutrients-K"]
                    ),
                    total_nutrients_s: this.safeNumber(
                        row["Total-Nutrients-S"]
                    ),
                    total_nutrients_m: this.safeNumber(
                        row["Total-Nutrients-Mg"]
                    ),
                    sns: row.SNS,
                    amount: row.Amount,
                    quality: row.Quality,
                    application: row.Application,
                    season: row.Season,
                    deleted: 0,
                    crop: field.crop,
                    name: "not used",
                    size: field.size,
                    soil: field.soil
                };

                field.events.push(newSpreadEvent);
            } else {
                // no spread nothing to do.
            }
        }
    }

    private async getDatabase(): Promise<SQLite.SQLiteDatabase> {
        if (this.database !== undefined) {
            return Promise.resolve(this.database);
        }
        // otherwise: open the database first
        return this.open();
    }
}

// Export a single instance of DatabaseImpl
export const database: Database = new DatabaseImpl();
