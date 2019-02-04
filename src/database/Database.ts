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
    public saveField(field: Field): Promise<void> {}
    public deleteField(field: Field): Promise<void> {}

    public getSpreadEvents(field: Field): Promise<Array<SpreadEvent>> {}
    public getSpreadEvent(id: number): Promise<SpreadEvent> {}
    public saveSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}
    public deleteSpreadEvent(spreadEvent: SpreadEvent): Promise<void> {}

    public getManures(): Promise<Array<Manure>> {}
    public saveManure(manure: Manure): Promise<void> {}
    public deleteManure(manure: Manure): Promise<void> {}

    // Insert a new list into the database
    public createList(newListTitle: string): Promise<void> {
        return this.getDatabase()
            .then(db =>
                db.executeSql("INSERT INTO List (title) VALUES (?);", [
                    newListTitle
                ])
            )
            .then(([results]) => {
                const { insertId } = results;
                console.log(
                    `[db] Added list with title: "${newListTitle}"! InsertId: ${insertId}`
                );
            });
    }

    // Get an array of all the lists in the database
    public getAllLists(): Promise<List[]> {
        console.log("[db] Fetching lists from the db...");
        return this.getDatabase()
            .then(db =>
                // Get all the lists, ordered by newest lists first
                db.executeSql(
                    "SELECT list_id as id, title FROM List ORDER BY id DESC;"
                )
            )
            .then(([results]) => {
                if (results === undefined) {
                    return [];
                }
                const count = results.rows.length;
                const lists: List[] = [];
                for (let i = 0; i < count; i++) {
                    const row = results.rows.item(i);
                    const { title, id } = row;
                    console.log(`[db] List title: ${title}, id: ${id}`);
                    lists.push({ id, title });
                }
                return lists;
            });
    }

    public addListItem(text: string, list: List): Promise<void> {
        if (list === undefined) {
            return Promise.reject(
                Error(`Could not add item to undefined list.`)
            );
        }
        return this.getDatabase()
            .then(db =>
                db.executeSql(
                    "INSERT INTO ListItem (text, list_id) VALUES (?, ?);",
                    [text, list.id]
                )
            )
            .then(([results]) =>
                console.log(
                    `[db] ListItem with "${text}" created successfully with id: ${
                        results.insertId
                    }`
                )
            );
    }

    public getListItems(list: List, orderByDone = false): Promise<ListItem[]> {
        if (list === undefined) {
            return Promise.resolve([]);
        }
        return this.getDatabase()
            .then(db =>
                db.executeSql(
                    `SELECT item_id as id, text, done FROM ListItem WHERE list_id = ? ${
                        orderByDone ? "ORDER BY done" : ""
                    };`,
                    [list.id]
                )
            )
            .then(([results]) => {
                if (results === undefined) {
                    return [];
                }
                const count = results.rows.length;
                const listItems: ListItem[] = [];
                for (let i = 0; i < count; i++) {
                    const row = results.rows.item(i);
                    const { text, done: doneNumber, id } = row;
                    const done = doneNumber === 1 ? true : false;

                    console.log(
                        `[db] List item text: ${text}, done? ${done} id: ${id}`
                    );
                    listItems.push({ id, text, done });
                }
                console.log(
                    `[db] List items for list "${list.title}":`,
                    listItems
                );
                return listItems;
            });
    }

    public updateListItem(listItem: ListItem): Promise<void> {
        const doneNumber = listItem.done ? 1 : 0;
        return this.getDatabase()
            .then(db =>
                db.executeSql(
                    "UPDATE ListItem SET text = ?, done = ? WHERE item_id = ?;",
                    [listItem.text, doneNumber, listItem.id]
                )
            )
            .then(([results]) => {
                console.log(`[db] List item with id: ${listItem.id} updated.`);
            });
    }

    public deleteList(list: List): Promise<void> {
        console.log(
            `[db] Deleting list titled: "${list.title}" with id: ${list.id}`
        );
        return this.getDatabase()
            .then(db => {
                // Delete list items first, then delete the list itself
                return db
                    .executeSql("DELETE FROM ListItem WHERE list_id = ?;", [
                        list.id
                    ])
                    .then(() => db);
            })
            .then(db =>
                db.executeSql("DELETE FROM List WHERE list_id = ?;", [list.id])
            )
            .then(() => {
                console.log(`[db] Deleted list titled: "${list.title}"!`);
                return;
            });
    }

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
