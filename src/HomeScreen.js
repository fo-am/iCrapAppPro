import React from "react";
import { StackNavigator } from "react-navigation";

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Crap App Pro</Text>
        <Button
          title="Press To Start"
          onPress={() => this.props.navigation.navigate("Map")}
        />
      </View>
    );
  }
}
