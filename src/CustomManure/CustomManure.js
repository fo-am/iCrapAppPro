import React, { Component } from "react";
import {
  Text,
  TextInput,
  Button,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Picker,
  Slider,
  Image
} from "react-native";
import styles from "styles/style";
import store from "react-native-simple-store";

export default class CustomManure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manure: {
        key: this.generateUUID(),
        name: "",
        N: "",
        P: "",
        K: ""
      }
    };
  }

  saveManure = () => {
    // get all from store

    var newManure = this.state.manure;

    if (!newManure.name) {
      newManure.name = "New Manure";
    }
    if (!newManure.N) {
      newManure.N = "0";
    }
    if (!newManure.P) {
      newManure.P = "0";
    }
    if (!newManure.K) {
      newManure.K = "0";
    }

    store
      .get("customManure")
      .then(res => {
        if (res instanceof Array) {
          return res;
        } else {
          return [];
        }
      })
      .then(manures => {
        // see if we have this ones ID
        var index = manures.findIndex(m => m.key === newManure.key);

        // if so update that one (delete and replace?)
        if (index !== -1) {
          manures.splice(index, 1);
        }

        manures.push(newManure);

        // clear store
        store
          .save("customManure", manures)
          .then(() => this.props.navigation.navigate("Home"));
      });
  };

  deleteManure = () => {
    store
      .get("customManure")
      .then(res => {
        if (res instanceof Array) {
          return res;
        } else {
          return [];
        }
      })
      .then(manures => {
        // see if we have this ones ID
        var index = manures.findIndex(m => m.key === this.state.manure.key);

        // if so update that one (delete and replace?)
        if (index !== -1) {
          manures.splice(index, 1);
        }

        // clear store
        store
          .save("customManure", manures)
          .then(() => this.props.navigation.navigate("Home"));
      });
  };
  cancel = () => {
    this.props.navigation.goBack();
  };

  generateUUID() {
    d = Date.now(); //high-precision timer

    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }
  componentWillMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("manure", null);
    if (item) {
      this.setState({ manure: item });
    }
  }
  render() {
    return (
      <View>
        <Text>Manure Name</Text>
        <TextInput
          //    defaultValue="My Manure"
          //    style={styles.textInput}
          keyboardType="default"
          onChangeText={text =>
            this.setState({ manure: { ...this.state.manure, name: text } })
          }
          placeholder="New Name"
          value={this.state.manure.name}
        />
        <Text>N kg/t content (elemental)</Text>
        <TextInput
          //    defaultValue="0"
          //    style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text =>
            this.setState({ manure: { ...this.state.manure, N: text } })
          }
          placeholder="0"
          value={this.state.manure.N}
        />
        <Text>P kg/t content (elemental)</Text>
        <TextInput
          //     defaultValue="0"
          //     style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text =>
            this.setState({ manure: { ...this.state.manure, P: text } })
          }
          placeholder="0"
          value={this.state.manure.P}
        />
        <Text>K kg/t content (elemental)</Text>
        <TextInput
          //      defaultValue="0"
          //     style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text =>
            this.setState({ manure: { ...this.state.manure, K: text } })
          }
          placeholder="0"
          value={this.state.manure.K}
        />
        <Button title="Cancel" onPress={this.cancel} />
        <Button title="OK" onPress={this.saveManure} />
        <Button title="Remove this manure" onPress={this.deleteManure} />
        <Text>foo {JSON.stringify(this.state.manure)}</Text>
      </View>
    );
  }
}
