import { inject, observer } from "mobx-react/native";
import React, { Component } from "react";
import { translate } from "react-i18next";
import { FlatList, ScrollView, StatusBar, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import data from "../assets/data/crop-menu.json";
import styles from "../styles/style";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
}

interface State {
  data: any;
  category: string;
  result: Array<string>;
}

@translate(["common"], { wait: true })
@inject("FieldStore")
@observer
export default class CropSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: data.options,
      category: data.category,
      result: []
    };
  }

  public render() {
    const { t, i18n } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView>
          <Text style={[styles.H1, { textAlign: "center" }]}>Crop Select</Text>
          <Text style={[styles.H2, { textAlign: "center" }]}>
            {this.state.category}
          </Text>
          <FlatList
            keyExtractor={(item, index) => "key" + index}
            data={this.state.data}
            renderItem={({ item }) => (
              <Button
                buttonStyle={[styles.roundButton]}
                titleStyle={styles.buttonText}
                onPress={() => this.buttonPress(item)}
                title={t(item.name) || t(item)}
              />
            )}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch"
            }}
          >
            <Button
              buttonStyle={[styles.footerButton, styles.bgColourRed]}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.goBack()}
              title="Cancel"
            />
            <Button
              buttonStyle={[styles.footerButton, styles.bgColourBlue]}
              titleStyle={styles.buttonText}
              onPress={() => {
                this.setState({
                  data: data.options,
                  category: data.category,
                  result: []
                });
              }}
              title="Back"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  private buttonPress(item) {
    // If we have a catagory then we have a next level.
    if (item.category) {
      this.setState({
        result: [...this.state.result, [this.state.category, item.name]]
      });
      this.setState({ category: item.category });
      this.setState({ data: item.options });
    } else {
      // end of the road!

      this.props.FieldStore.field.cropType = [
        ...this.state.result,
        [this.state.category, item]
      ];
      this.props.navigation.goBack();
    }
  }
}
