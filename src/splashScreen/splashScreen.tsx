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
import { Image, View, StatusBar, Dimensions } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
}

interface MyComponentState {}

@translate(["common"], { wait: true })
@inject("FieldStore")
@observer
export default class SplashScreen extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { t, i18n, navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Container>
          <StatusBar barStyle="dark-content" />
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
                  Begin >
                </Text>
              </Button>
            </Right>
          </Header>
          <Content scrollEnabled={false}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <H1
                style={{ paddingTop: "5%", fontFamily: "ArimaMadurai-Regular" }}
              >
                {t("the-farm-crap-app-pro")}
              </H1>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "ArimaMadurai-Regular"
                }}
              >
                {t("introduction")}
              </Text>

              <Image
                source={require("../../resources/splash.png")}
                style={{
                  width: Dimensions.get("window").height * 0.6,
                  height: Dimensions.get("window").height * 0.6
                }}
              />
            </View>
          </Content>
          <Footer />
        </Container>
      </SafeAreaView>
    );
  }
}
