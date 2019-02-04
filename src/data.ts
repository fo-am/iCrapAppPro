import { Component } from "react";
import SQLite from "react-native-sqlite-storage";

export default class Data extends Component {
    public componentDidMount() {
        SQLite.DEBUG(true);
        SQLite.enablePromise(true);

        SQLite.openDatabase({
            name: "TestDatabase",
            location: "default"
        }).then(db => {
            console.log("Database open!");
        });
    }
}

// https://brucelefebvre.com/blog/2018/11/06/react-native-offline-first-db-with-sqlite/
