import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  Form,
  H1,
  H2,
  H3,
  Header,
  Left,
  Right,
  Text,
  Title
} from "native-base";
import React, { Component } from "react";
import { Image } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import FieldStore from "../store/FieldsStore";
import ManureStore from "../store/manureStore";
import styles from "../styles/style";
import image from "../../resources/splash.png";

interface MyComponentProps {
  navigation: NavigationScreenProp<any, any>;
}

interface MyComponentState {}

@inject("FieldStore")
@observer
export default class HomeScreen extends Component<
  MyComponentProps,
  MyComponentState
> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Farm Crap App Pro</Title>
          </Body>
          <Right>
            <Button
              hasText
              transparent
              onPress={() =>
                this.props.navigation.navigate("Field", {
                  fieldKey: undefined
                })
              }
            >
              <Text>Begin</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 15
            }}
          >
            <H1>The Farm Crap App</H1>
            <Text>Manage your muck with the Farm Crap App</Text>

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
