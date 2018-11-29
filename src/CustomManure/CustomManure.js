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

export default class CustomManure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "My Manure",
      N: "0",
      P: "0",
      K: "0",
      saved: false
    };
  }

  saveManure = () => {
    this.setState({ saved: true });
  };

  cancel = () => {
    this.setState({ saved: false });
  };

  render() {
    return (
      <View>
        <Text>Manure Name</Text>
        <TextInput
          defaultValue="My Manure"
          //    style={styles.textInput}
          keyboardType="default"
          onChangeText={text => this.setState({ name: text })}
          value={this.state.names}
        />
        <Text>N kg/t content (elemental)</Text>
        <TextInput
          defaultValue="0"
          //    style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text => this.setState({ N: text })}
          value={this.state.N}
        />
        <Text>P kg/t content (elemental)</Text>
        <TextInput
          defaultValue="0"
          //     style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text => this.setState({ P: text })}
          value={this.state.P}
        />
        <Text>K kg/t content (elemental)</Text>
        <TextInput
          defaultValue="0"
          //     style={styles.textInput}
          keyboardType="numeric"
          onChangeText={text => this.setState({ K: text })}
          value={this.state.K}
        />
        <Button title="Cancel" onPress={() => cancel} />
        <Button title="OK" onPress={() => saveManure} />
      </View>
    );
  }
}
