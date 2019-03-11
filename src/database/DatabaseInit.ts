/**
 * React Native SQLite Demo
 * Copyright (c) 2018 Bruce Lefebvre <bruce@brucelefebvre.com>
 * https://github.com/blefebvre/react-native-sqlite-demo/blob/master/LICENSE
 */
import SQLite from "react-native-sqlite-storage";

export class DatabaseInitialization {
    // Perform any updates to the database schema.
    // These can occur during initial configuration, or after an app store update.
    // This should be called each time the database is opened.
    public updateDatabaseTables(
        database: SQLite.SQLiteDatabase
    ): Promise<void> {
        let dbVersion: number = 0;
        console.log("Beginning database updates...");

        // First: create tables if they do not already exist
        return database
            .transaction(this.createTables)
            .then(() => {
                // Get the current database version
                return this.getDatabaseVersion(database);
            })
            .then(version => {
                dbVersion = version;
                console.log("Current database version is: " + dbVersion);

                // Perform DB updates based on this version

                // This is included as an example of how you make database schema changes once the app has been shipped
                if (dbVersion < 1) {
                    // Uncomment the next line, and the referenced function below, to enable this
                    // return database.transaction(this.preVersion1Inserts);
                }
                // otherwise,
                return;
            })
            .then(() => {
                if (dbVersion < 2) {
                    // Uncomment the next line, and the referenced function below, to enable this
                    // return database.transaction(this.preVersion2Inserts);
                }
                // otherwise,
                return;
            });
    }

    // Perform initial setup of the database tables
    private createTables(transaction: SQLite.Transaction) {
        // DANGER! For dev only
        const dropAllTables = false;
        if (dropAllTables) {
            transaction.executeSql("DROP TABLE IF EXISTS Farm;");
            transaction.executeSql("DROP TABLE IF EXISTS Field;");
            transaction.executeSql("DROP TABLE IF EXISTS SpreadEvent;");
            transaction.executeSql("DROP TABLE IF EXISTS Settings;");
            transaction.executeSql("DROP TABLE IF EXISTS Manure;");
            transaction.executeSql("DROP TABLE IF EXISTS AppSettings;");
            transaction.executeSql("DROP TABLE IF EXISTS Version;");
        }

        // Farm table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS "Farm" (
                "Farm-Unique-Id"	TEXT NOT NULL PRIMARY KEY UNIQUE,
                "Latitude"	NUMERIC NOT NULL,
                "Longitude"	NUMERIC NOT NULL,
                "Name"	TEXT NOT NULL,
                "Rainfall"	TEXT NOT NULL,
                "Cost-N"	NUMERIC NOT NULL,
                "Cost-P"	NUMERIC NOT NULL,
                "Cost-K"	NUMERIC NOT NULL
            );`
        );

        // Field table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS  "Field" (
            "Field-Unique-Id"	TEXT NOT NULL PRIMARY KEY UNIQUE,
            "FarmKey"	TEXT NOT NULL,
            "Name"	TEXT NOT NULL,
            "Coordinates"	TEXT NOT NULL,
            "Soil"	TEXT NOT NULL,
            "Crop"	TEXT NOT NULL,
            "Previous-Crop"	TEXT,
            "Soil-Test-P"	TEXT,
            "Soil-Test-K"	TEXT,
            "Regular-Manure"	TEXT,
            "Recent-Grass"	TEXT,
            "Size"	NUMERIC
             );`
        );
        // SpreadEvent Table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS "SpreadEvent" (
            "SpreadEvent-Unique-Id"	TEXT NOT NULL PRIMARY KEY UNIQUE,
            "FieldKey" TEXT NOT NULL,
            "Manure-Type" Text Not Null,
            "Date"	TEXT NOT NULL,
            "Quality"	TEXT,
            "Application"	TEXT,
            "Amount"	NUMERIC NOT NULL,
            "Nutrients-N"	NUMERIC NOT NULL,
            "Nutrients-P"	NUMERIC NOT NULL,
            "Nutrients-K"	NUMERIC NOT NULL,
            "Require-N"	NUMERIC NOT NULL,
            "Require-P"	NUMERIC NOT NULL,
            "Require-K"	NUMERIC NOT NULL,
            "SNS"	NUMERIC NOT NULL,
            "Soil"	TEXT NOT NULL,
            "Size"	NUMERIC NOT NULL,
            "Season"	TEXT NOT NULL,
             "Crop"	TEXT NOT NULL
             );`
        );
        // Manure Table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS  "Manure" (
            "Manure-Unique-Id"	TEXT NOT NULL  PRIMARY KEY UNIQUE,
            "Name" TEXT NOT NULL,
            "N"	NUMERIC NOT NULL,
            "P"	NUMERIC NOT NULL,
            "K"	NUMERIC NOT NULL
             );`
        );

        // AppSettings Table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS  "AppSettings" (
            "AppSettingsId"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "User-Id" TEXT NOT NULL,
            "Language"	TEXT NOT NULL,
            "Email"	TEXT NOT NULL,
            "Units"	TEXT NOT NULL
             );`
        );

        // Version table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS Version(
                version_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                version INTEGER);`
        );
    }

    // Get the version of the database, as specified in the Version table
    private getDatabaseVersion(
        database: SQLite.SQLiteDatabase
    ): Promise<number> {
        // Select the highest version number from the version table
        return database
            .executeSql(
                "SELECT version FROM Version ORDER BY version DESC LIMIT 1;"
            )
            .then(([results]) => {
                if (results.rows && results.rows.length > 0) {
                    const version = results.rows.item(0).version;
                    return version;
                } else {
                    return 0;
                }
            })
            .catch(error => {
                console.log(`No version set. Returning 0. Details: ${error}`);
                return 0;
            });
    }

    // Once the app has shipped, use the following functions as a template for updating the database:
    /*
    // This function should be called when the version of the db is < 1
    private preVersion1Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 1 DB inserts");
        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");
        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (1);");
    }
    // This function should be called when the version of the db is < 2
    private preVersion2Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 2 DB inserts");

        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");
        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (2);");
    }
    */
}
