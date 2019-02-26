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
import { Image } from "react-native";
import { NavigationScreenProp } from "react-navigation";

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
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>{t("the-farm-crap-app-pro")}</Title>
          </Body>
          <Right>
            <Button
              hasText
              transparent
              onPress={() =>
                this.props.navigation.navigate("Home", {
                  fieldKey: undefined
                })
              }
            >
              <Text>Begin</Text>
            </Button>
          </Right>
        </Header>
        <Content scrollEnabled={false}>
          <Form
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 15
            }}
          >
            <H1>{t("the-farm-crap-app-pro")}</H1>
            <Text style={{ textAlign: "center" }}>{t("introduction")}</Text>

            <Image
              source={require("../../resources/splash.png")}
              style={{
                width: 500,
                height: 500
              }}
            />
          </Form>
        </Content>
        <Footer />
      </Container>
    );
  }
}
