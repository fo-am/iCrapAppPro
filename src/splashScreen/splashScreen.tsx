import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  Form,
  H1,
  Header,
  Left,
  Right,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import { translate } from "react-i18next";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  View
} from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";
import ImportFileCheck from "../Export/ImportFileCheck";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
}

interface MyComponentState {
  showInfo: boolean;
}

@translate(["common"], { wait: true })
@inject("FieldStore")
@observer
export default class SplashScreen extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
    this.state = { showInfo: false };
  }

  public render() {
    const { t, i18n, navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ImportFileCheck navigation={this.props.navigation} />
        <Container>
          <StatusBar barStyle="light-content" />
          <Header>
            <Left />
            <Body />
            <Right>
              <Button
                transparent
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Text
                  style={{
                    fontFamily: "ArimaMadurai-Regular",
                    fontSize: 30,
                    paddingBottom: 20,
                    paddingRight: 20,
                    margin: -10,
                    fontWeight: "bold"
                  }}
                >
                  Begin
                </Text>
              </Button>
            </Right>
          </Header>
          <Content scrollEnabled={true}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <H1
                style={{
                  paddingTop: "5%",
                  fontFamily: "ArimaMadurai-Regular",
                  textAlign: "center"
                }}
              >
                {t("the-farm-crap-app-pro")}
              </H1>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "ArimaMadurai-Regular",
                  paddingBottom: 50
                }}
              >
                {t("splash-about")}
              </Text>
              <Image
                source={require("../../resources/icon.png")}
                style={{
                  width: Dimensions.get("window").height * 0.2,
                  height: Dimensions.get("window").height * 0.2
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 10,
                  fontSize: 20,
                  fontFamily: "ArimaMadurai-Regular"
                }}
              >
                Version 1.0
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  fontFamily: "ArimaMadurai-Regular"
                }}
              >
                Build 57
              </Text>
            </View>
          </Content>
          <Footer>
            <Left>
              <Button transparent onPress={() => this.ToggleInfoPane()}>
                <Text
                  style={{ color: "black", fontFamily: "ArimaMadurai-Regular" }}
                >
                  Info
                </Text>
              </Button>
            </Left>
          </Footer>
        </Container>
        <Modal
          style={{
            marginTop: 22,
            backgroundColor: "#D5D5D5"
          }}
          animationType="slide"
          transparent={false}
          visible={this.state.showInfo}
          onRequestClose={() => {}}
        >
          <ScrollView
            scrollEnabled={true}
            style={{ padding: 30, marginBottom: 50 }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: "ArimaMadurai-Regular",
                textAlign: "center"
              }}
            >
              {t("splash-blurb")}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "ArimaMadurai-Regular",
                textAlign: "center"
              }}
            >
              {t("splash-discl")}
            </Text>
          </ScrollView>

          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              marginBottom: 20
            }}
          >
            <Button
              style={{
                width: "100%"
              }}
              onPress={() => this.ToggleInfoPane()}
            >
              <Text
                style={{
                  textAlign: "center",
                  width: "100%",
                  color: "black",
                  fontFamily: "ArimaMadurai-Regular"
                }}
              >
                Done
              </Text>
            </Button>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
  public ToggleInfoPane(): void {
    this.setState({ showInfo: !this.state.showInfo });
  }
}
