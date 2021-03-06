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
                    return database.transaction(trans =>
                        this.preVersion1Inserts(trans)
                    );
                }
                // otherwise,
                return undefined;
            })
            .then(() => {
                if (dbVersion < 2) {
                    return database.transaction(trans =>
                        this.preVersion2Inserts(trans)
                    );
                }
                // otherwise,
                return undefined;
            })
            .then(() => {
                if (dbVersion < 3) {
                    return database.transaction(trans =>
                        this.preVersion3Inserts(trans)
                    );
                }
                // otherwise,
                return undefined;
            })
            .then(() => {
                if (dbVersion < 4) {
                    return database.transaction(trans =>
                        this.preVersion4Inserts(trans)
                    );
                }
                // otherwise,
                return undefined;
            })
            .then(() => {
                if (dbVersion < 5) {
                    return database.transaction(trans =>
                        this.preVersion5Inserts(trans)
                    );
                }
                // otherwise,
                return undefined;
            })

            .catch(error => console.log("error " + error));
    }

    // Perform initial setup of the database tables
    private createTables(transaction: SQLite.Transaction) {
        // DANGER! For dev only
        const dropAllTables = false;
        if (dropAllTables) {
            transaction.executeSql("DROP TABLE IF EXISTS Farm;");
            transaction.executeSql("DROP TABLE IF EXISTS Field;");
            transaction.executeSql("DROP TABLE IF EXISTS SpreadEvent;");
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
                "Cost-K"	NUMERIC NOT NULL,
                "Cost-S"	NUMERIC NOT NULL,
                "Cost-Mg"	NUMERIC NOT NULL,
                "Deleted" NUMERIC NOT NULL
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
            "Soil-Test-Mg"	TEXT,
            "Regular-Manure"	TEXT,
            "Recent-Grass"	TEXT,
            "Size"	NUMERIC,
            "Deleted" NUMERIC NOT NULL
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
            "Total-Nutrients-N"  NUMERIC NOT NULL,
            "Total-Nutrients-P"  NUMERIC NOT NULL,
            "Total-Nutrients-K"  NUMERIC NOT NULL,
            "Total-Nutrients-S"  NUMERIC NOT NULL,
            "Total-Nutrients-Mg" NUMERIC NOT NULL,
            "SNS"	NUMERIC NOT NULL,
            "Soil"	TEXT NOT NULL,
            "Size"	NUMERIC NOT NULL,
            "Season"	TEXT NOT NULL,
             "Crop"	TEXT NOT NULL,
             "Deleted" NUMERIC NOT NULL
             );`
        );
        // Manure Table
        transaction.executeSql(
            `CREATE TABLE IF NOT EXISTS  "Manure" (
            "Manure-Unique-Id"	TEXT NOT NULL  PRIMARY KEY UNIQUE,
            "Name" TEXT NOT NULL,
            "N"	NUMERIC NOT NULL,
            "P"	NUMERIC NOT NULL,
            "K"	NUMERIC NOT NULL,
            "S"	NUMERIC NOT NULL,
            "Mg" NUMERIC NOT NULL,
            "Deleted" NUMERIC NOT NULL
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

    // This function should be called when the version of the db is < 1
    private preVersion1Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 1 DB inserts");
        // Make schema changes
        transaction
            .executeSql(
                `ALTER TABLE Manure ADD COLUMN "Type" TEXT NOT NULL DEFAULT "custom-slurry-dm2";`
            )
            .catch(error => console.log("error " + error));

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (1);");
    }

    // This function should be called when the version of the db is < 2
    private preVersion2Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 2 DB inserts");

        // Make schema changes

        transaction
            .executeSql(
                `ALTER TABLE SpreadEvent ADD COLUMN "Nutrients-S"	NUMERIC NOT NULL Default 0;`
            )
            .catch(error => console.log("error " + error));
        transaction
            .executeSql(
                `ALTER TABLE SpreadEvent ADD COLUMN "Nutrients-Mg"	NUMERIC NOT NULL Default 0;`
            )
            .catch(error => console.log("error " + error));
        transaction
            .executeSql(
                `ALTER TABLE SpreadEvent ADD COLUMN "Require-S"	NUMERIC NOT NULL Default 0;`
            )
            .catch(error => console.log("error " + error));
        transaction
            .executeSql(
                `ALTER TABLE SpreadEvent ADD COLUMN "Require-Mg"	NUMERIC NOT NULL Default 0;`
            )
            .catch(error => console.log("error " + error));

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (2);");
    }

    // This function should be called when the version of the db is < 3
    private preVersion3Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 3 DB inserts");

        // Make schema changes

        transaction
            .executeSql(`ALTER TABLE SpreadEvent ADD COLUMN "ImageUri" TEXT;`)
            .catch(error => console.log("error " + error));

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (3);");
    }
    private preVersion4Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 4 DB inserts");

        // Make schema changes

        transaction
            .executeSql(
                `ALTER TABLE AppSettings ADD COLUMN "BackupSchedule" TEXT;`
            )
            .catch(error => console.log("error " + error));

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (4);");
    }
    private preVersion5Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 5 DB inserts");

        // Make schema changes

        transaction
            .executeSql(`ALTER TABLE Farm ADD COLUMN "LastBackup" TEXT;`)
            .catch(error => console.log("error " + error));

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (5);");
    }
}
