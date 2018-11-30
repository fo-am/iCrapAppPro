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
    store
      .push("customManure", this.state.manure)
      .then(() => this.props.navigation.goBack());
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
  componentDidMount() {
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
          placeholder="name"
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
          value={this.state.manure.K}
        />
        <Button title="Cancel" onPress={this.cancel} />
        <Button title="OK" onPress={this.saveManure} />
        <Text>foo {JSON.stringify(this.state.manure)}</Text>
      </View>
    );
  }
}
