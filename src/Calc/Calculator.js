import React, { Component } from "react";
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Picker,
    Slider,
    Image
} from "react-native";
import store from "react-native-simple-store";
import styles from "../styles/style";
import data from "../assets/data/manure.json";
import dropDownData from "./dropDownData.json";
import DropDown from "./DropDown";
import Images from "../assets/imageData";

export default class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soilType: null,
            manureSelected: "fym",
            applicationSelected: null,
            soilSelected: null,
            cropSelected: null,
            seasonSelected: null,
            qualitySelected: null,
            applicationTypes: {},
            qualityTypes: {},
            customQualityTypes: {},
            sliderValue: null,
            sliderStartValue: null,
            sliderMaxValue: 1,
            sliderUnit: null,
            image: null,
            Nitrogen: null,
            Phosphorus: null,
            Potassium: null,
            testArray: {},
            testVal: null
        };

        this.state.applicationTypes =
            dropDownData[this.state.manureSelected].dropDowns.application;
        this.state.qualityTypes =
            dropDownData[this.state.manureSelected].dropDowns.quality;
        this.state.sliderStartValue =
            dropDownData[this.state.manureSelected].slider.maxValue / 2;
        this.state.sliderValue =
            dropDownData[this.state.manureSelected].slider.maxValue / 2;
        this.state.sliderMaxValue =
            dropDownData[this.state.manureSelected].slider.maxValue;
        this.state.sliderUnit =
            dropDownData[this.state.manureSelected].slider.metricUnit;

        store.get("customManure").then(res => {
            var values = {};
            res.forEach(function(o) {
                values[o.key] = o.name;
            });

            this.state.customQualityTypes = values;
        });
    }

    componentDidMount() {
        this.SelectManure(this.state.manureSelected);
    }

    getSoil(value) {
        var soil = "";
        for (key in data.choices) {
            if (data.choices[key].choice === value) {
                soil = JSON.stringify(data.choices[key].value);
            }
        }

        this.setState({ soilType: soil });
    }
    getN() {
        var keys = [];
        for (var k in data.choices) keys.push(k.value);

        this.setState({ testArray: keys });
    }

    SelectManure(itemValue) {
        this.setState({ manureSelected: itemValue });
        if (itemValue === "custom") {
            this.setState(
                {
                    applicationTypes: {},
                    qualityTypes: this.state.customQualityTypes,
                    sliderStartValue: 50,
                    sliderValue: 50,
                    sliderMaxValue: 100,
                    sliderUnit: "m3/ha"
                },
                () => this.SliderValueChanged(this.state.sliderValue)
            );
        } else {
            this.setState(
                {
                    applicationTypes:
                        dropDownData[itemValue].dropDowns.application,
                    qualityTypes: dropDownData[itemValue].dropDowns.quality,
                    sliderStartValue:
                        dropDownData[itemValue].slider.maxValue / 2,
                    sliderValue: dropDownData[itemValue].slider.maxValue / 2,
                    sliderMaxValue: dropDownData[itemValue].slider.maxValue,
                    sliderUnit: dropDownData[itemValue].slider.metricUnit
                },
                () => this.SliderValueChanged(this.state.sliderValue)
            );
        }
    }

    SliderValueChanged(value) {
        this.getN();
        this.setState({ sliderValue: value });

        var keys = [];
        for (var k in Images[this.state.manureSelected]) keys.push(k);

        var closestValue = this.closest(value, keys);
        if (this.state.manureSelected == "custom") {
            this.setState({ image: Images["fym"]["50"] });
        } else {
            this.setState({
                image: Images[this.state.manureSelected][closestValue]
            });
        }
    }

    SelectApplicationType(itemValue) {
        this.setState({ applicationSelected: itemValue });
    }

    closest(num, arr) {
        var curr = arr[0];
        var diff = Math.abs(num - curr);
        for (var val = 0; val < arr.length; val++) {
            var newdiff = Math.abs(num - arr[val]);
            if (newdiff < diff) {
                diff = newdiff;
                curr = arr[val];
            }
        }
        return curr;
    }

    render() {
        var manureTypes = {
            cattle: "Cattle Slurry",
            fym: "Farmyard Manure",
            pig: "Pig Slurry",
            poultry: "Poultry Litter",
            compost: "Compost",
            custom: "Custom"
        };

        var cropType = {
            "winter-wheat-incorporated-feed":
                "Winter wheat, straw incorporated, feed",
            "winter-wheat-incorporated-mill":
                "Winter wheat, straw incorporated, mill",
            "winter-wheat-removed-feed": "Winter wheat, straw removed, feed",
            "winter-wheat-removed-mill": "Winter wheat, straw removed, mill",
            "spring-barley-incorporated-feed":
                "Spring barley, straw incorporated, feed",
            "spring-barley-incorporated-malt":
                "Spring barley, straw incorporated, malt",
            "spring-barley-removed-feed": "Spring barley, straw removed, feed",
            "spring-barley-removed-malt": "Spring barley, straw removed, malt",
            "grass-cut": "Grass cut",
            "grass-grazed": "Grass grazed"
        };
        var soilType = {
            sandyshallow: "Sandy/Shallow",
            peat: "Peat",
            organic: "Organic (10-20% organic matter)",
            mediumshallow: "Medium/Shallow",
            medium: "Medium",
            deepclay: "Deep clay",
            deepsilt: "Deep silt"
        };
        var season = {
            autumn: "Autumn",
            winter: "Winter",
            spring: "Spring",
            summer: "Summer"
        };

        //  var manureApplicationTypes = {};
        return (
            <ScrollView>
                <View style={styles.container}>
                    <StatusBar />
                    <Text syle={styles.text}>
                        Calculator for crap calculations.
                    </Text>

                    <Text>Manure Type</Text>
                    <DropDown
                        selectedValue={this.state.manureSelected}
                        onChange={item => this.SelectManure(item)}
                        values={manureTypes}
                    />

                    <Text>Application Type</Text>
                    <DropDown
                        selectedValue={this.state.applicationSelected}
                        onChange={item =>
                            this.setState({ applicationSelected: item })
                        }
                        values={this.state.applicationTypes}
                    />

                    <Text>Soil Type</Text>
                    <DropDown
                        selectedValue={this.state.soilSelected}
                        onChange={item => this.setState({ soilSelected: item })}
                        values={soilType}
                    />
                    <Text>Crop Type</Text>
                    <DropDown
                        selectedValue={this.state.cropSelected}
                        onChange={item => this.setState({ cropSelected: item })}
                        values={cropType}
                    />
                    <Text>Season</Text>
                    <DropDown
                        selectedValue={this.state.seasonSelected}
                        onChange={item =>
                            this.setState({ seasonSelected: item })
                        }
                        values={season}
                    />
                    <Text>Quality</Text>
                    <DropDown
                        selectedValue={this.state.qualitySelected}
                        onChange={item =>
                            this.setState({ qualitySelected: item })
                        }
                        values={this.state.qualityTypes}
                    />
                    <View style={styles.container}>
                        <Slider
                            step={0.1}
                            value={this.state.sliderStartValue}
                            onValueChange={val => this.SliderValueChanged(val)}
                            maximumValue={this.state.sliderMaxValue}
                            thumbTintColor="rgb(252, 228, 149)"
                            minimumTrackTintColor="#FF0000"
                            maximumTrackTintColor="#206F98"
                        />
                        <Text>
                            Value: {this.state.sliderValue}{" "}
                            {this.state.sliderUnit}
                        </Text>
                    </View>

                    <Image source={this.state.image} />
                    <Text>Crop available nutrients(Total in manure)</Text>
                    <Text>N {this.state.Nitrogen}</Text>
                    <Text>P2O5 {this.state.Phosphorus}</Text>
                    <Text>K2O {this.state.Potassium}</Text>
                    <Text>Fertiliser Savings</Text>

                    <Text>c{JSON.stringify(this.state.testArray)}</Text>
                </View>
            </ScrollView>
        );
    }
}
