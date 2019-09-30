import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

import styles from "../styles/style";

import { RNCamera } from "react-native-camera";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import ImportFileCheck from "../Export/ImportFileCheck";

interface Props {
  navigation: NavigationScreenProp<any, any>;
  FieldStore: FieldStore;
}

interface State {}

@inject("FieldStore")
@observer
export default class Camera extends Component<Props, State> {
  private camera: RNCamera;
  constructor(props) {
    super(props);

    const { FieldStore } = this.props;
  }

  public componentDidMount() {
    const { FieldStore } = this.props;
  }

  public render() {
    const { FieldStore } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ImportFileCheck navigation={this.props.navigation} />
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.box}>
          <Text style={styles.H2}>Take a picture of your spread</Text>
          <RNCamera
            ref={ref => (this.camera = ref)}
            captureAudio={false}
            mirrorImage={false}
            ratio="1:1"
            style={{ flex: 1, width: 200, height: 200 }}
          >
            <Button
              buttonStyle={[styles.roundButton, styles.bgColourBlue]}
              titleStyle={styles.buttonText}
              onPress={() => this.takeImage()}
              title="Take"
            />
          </RNCamera>
          <Image
            source={{ uri: FieldStore.newSpreadEvent.imagePath }}
            style={{ width: 200, height: 200 }}
          />
          <Button
            buttonStyle={[styles.roundButton]}
            titleStyle={styles.buttonText}
            onPress={() => this.props.navigation.pop()}
            title="Done"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
  private async takeImage() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.props.FieldStore.newSpreadEvent.imagePath = data.uri;
    }
  }
}
