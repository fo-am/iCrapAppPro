import { autorun, observable } from "mobx";

import CalculatorValues from "../model/CalculatorValues";
import CropRequirementsResult from "../model/cropRequirementsResult";
import Field from "../model/field";
import Manure from "../model/manure";
import NutrientResult from "../model/NutrientResult";

import { database } from "../database/Database";

import cropRequirementsNitrogenTree from "../assets/data/crop-requirements-n.json";
import cropRequirementsPhosphorousPotassiumTree from "../assets/data/crop-requirements-pk.json";
import previousGrassSoilNitrogenSupplyTree from "../assets/data/previous-grass-soil-nitrogen-supply.json";

import manureTree from "../assets/data/manure.json";
import nitrogenTotalTree from "../assets/data/n-total.json";
import soilNitrogenSupplyTree from "../assets/data/soil-nitrogen-supply.json";

class CalculatorStore {
    @observable public calculatorValues = new CalculatorValues();
    @observable public nutrientResults = new NutrientResult();

    @observable public soilType: string | undefined;
    @observable public applicationTypes: Array<string>;
    @observable public qualityTypes: Array<string>;
    @observable public customQualityTypes: Array<string>;

    @observable public image: string | undefined;

    @observable public rainfall: string = "";

    private grasslandHighSNS: number = 100;
    private grasslandMedSNS: number = 101;
    private grasslandLowSNS: number = 102;

    constructor() {
        const disposer = autorun(() => this.getNutrientValues(), {
            delay: 10
        });
    }

    // Calculates the cost of a nutrient
    public getCostStringFromNutrient(
        nutrientIndex,
        amounts,
        multiplier
    ): String {
        if (!isNaN(amounts[nutrientIndex])) {
            return String(
                (
                    amounts[nutrientIndex] *
                    2 * // this.settingsProvider.costs[nutrientIndex]
                    multiplier
                ).toFixed(2)
            );
        } else {
            return "N/A";
        }
    }

    // Calculate soil nitrogen supply
    public calculateSNS(
        rainfall,
        soil,
        crop,
        previousCrop,
        regularlyManure,
        recentlyGrownGrass
    ): number {
        // Define decision tree criteria
        // Soil 'medium' category does not exist in SNS tables, so substitute it for 'mediumshallow'
        const params = {
            rainfall,
            soil: soil === "medium" ? "mediumshallow" : soil,
            "previous-crop": previousCrop
        };
        // Special options needed if previous crop is grass
        if (
            this.isPreviousCropGrass(previousCrop) &&
            !this.isCropArable(crop)
        ) {
            // grass -> grass (pp188) - The field is staying as grass
            return this.grasslandModifier(soil, recentlyGrownGrass);
        } else if (
            this.isCropArable(crop) &&
            this.isPreviousCropGrass(previousCrop)
        ) {
            // grass -> arable (pp94) - The field is converting from grassland to arable land
            return this.snsSearch(
                previousGrassSoilNitrogenSupplyTree,
                params,
                regularlyManure
            );
        } else {
            return this.snsSearch(
                soilNitrogenSupplyTree,
                params,
                regularlyManure
            );
        }
    }
    public CalculateCropRequirements(): string {
        return "";
    }

    public getCropRequirementsSupplyFromField(
        field: Field
    ): CropRequirementsResult {
        // this horror takes an array of array of string and
        // turns it into an object, this is later "spread" to form the params passed to 'decision

        const cropObject = field.cropType
            .slice()
            .reduce(
                (object, [key, value]) => ((object[key] = value), object),
                {}
            );

        const temp = this.getCropRequirementsSupply(
            this.rainfall,
            cropObject,
            field.soilType,
            field.prevCropType,
            field.organicManure,
            field.soilTestP,
            field.soilTestK,
            field.recentGrass
        );

        const values = new CropRequirementsResult();
        values.nitrogenSupply = temp.nitrogenSupply;
        values.nitrogenRequirement = temp.nitrogenRequirement;
        values.phosphorousRequirement = temp.phosphorousRequirement;
        values.potassiumRequirement = temp.phosphorousRequirement;

        return values;
    }

    public getCropRequirementsSupply(
        rainfall,
        crop,
        soil,
        previousCrop,
        regularlyManure,
        soilTestP,
        soilTestK,
        recentlyGrownGrass
    ) {
        const sns = this.calculateSNS(
            rainfall,
            soil,
            crop,
            previousCrop,
            regularlyManure,
            recentlyGrownGrass
        );
        const choices = {
            sns, // sns not used for grass requirement, ok to be grassland low/med/high
            rainfall,
            soil,
            ...crop,
            "p-index": soilTestP,
            "k-index": soilTestK
        };
        let nitrogenRequirement = this.decision(
            cropRequirementsNitrogenTree,
            choices
        );
        // add/subtract based on table on pp188
        if (sns === this.grasslandHighSNS) {
            nitrogenRequirement -= 30;
        }
        if (sns === this.grasslandLowSNS) {
            nitrogenRequirement += 30;
        }
        const phosphorousRequirement = this.decision(
            cropRequirementsPhosphorousPotassiumTree,
            { nutrient: "phosphorus", ...choices }
        );
        const potassiumRequirement = this.decision(
            cropRequirementsPhosphorousPotassiumTree,
            { nutrient: "potassium", ...choices }
        );
        return {
            nitrogenRequirement,
            phosphorousRequirement,
            potassiumRequirement,
            nitrogenSupply: sns
        };
    }

    public getNutrientValues() {
        this.calculateNutrients(
            this.calculatorValues.manureSelected,
            this.calculatorValues.sliderValue,
            this.calculatorValues.qualitySelected,
            this.calculatorValues.seasonSelected,
            this.calculatorValues.cropSelected,
            this.calculatorValues.soilSelected,
            this.calculatorValues.applicationSelected,
            this.calculatorValues.soilTestP,
            this.calculatorValues.soilTestK
        ).then(results => {
            // n
            this.nutrientResults.nitrogenTotal = results[1][0];
            this.nutrientResults.nitrogenAvailable = results[0][0];
            // p
            this.nutrientResults.phosphorousTotal = results[1][1];
            this.nutrientResults.phosphorousAvailable = results[0][1];
            // k
            this.nutrientResults.potassiumTotal = results[1][2];
            this.nutrientResults.potassiumAvailable = results[0][2];
        });
    }
    public async calculateNutrients(
        type,
        amount,
        quality,
        season,
        crop,
        soil,
        application,
        soilTestP,
        soilTestK
    ): Promise<Array<Array<number>>> {
        if (type === "custom") {
            return database.getManure(quality).then((manure: Manure) => {
                if (manure.N) {
                    const nutrients = this.processNutrients(amount, [
                        manure.N,
                        manure.P,
                        manure.K
                    ]);
                    if (nutrients) {
                        return [
                            // total
                            nutrients,
                            // avail (duplicate)
                            nutrients
                        ];
                    }
                }
                return [[0, 0, 0], [0, 0, 0]];
            });
        } else {
            return this.getNutrients(
                type,
                amount,
                quality,
                season,
                crop,
                soil,
                application,
                soilTestP,
                soilTestK
            );
        }
    }

    private getNutrients(
        type,
        amount,
        quality,
        season,
        crop,
        soil,
        application,
        soilTestP,
        soilTestK
    ): Object {
        const params = {
            type,
            quality,
            season,
            // IMPORTANT: we have to convert crop from the field types to send to manure
            crop:
                crop === "grass-oilseed" || crop === "grass"
                    ? "grass-oilseed"
                    : "normal",
            // also we have to convert soil to the two types in manure (pp 66, note b)
            soil:
                soil === "sandyshallow" || "mediumshallow"
                    ? "sandyshallow"
                    : "mediumheavy",
            application
        };
        // get the total for pig or cattle slurry or poultry, then we apply the
        // percent value later to get the crop available
        const total =
            type === "pig" || type === "cattle" || type === "poultry"
                ? this.decision(nitrogenTotalTree, params)
                : 0;
        // high soil test means we're adding total
        const phosphorous =
            soilTestP === "soil-p-2" || soilTestP === "soil-p-3"
                ? "p-total"
                : "p-avail";
        const potassium =
            soilTestK === "soil-k-2-" ||
            soilTestK === "soil-k-2+" ||
            soilTestK === "soil-k-3"
                ? "k-total"
                : "k-avail";

        // Total values
        const totalValues = this.processNutrients(amount, [
            // if pig or cattle slurry, then this is the percent value
            total === 0
                ? this.decision(manureTree, { ...params, nutrient: "n-total" })
                : total,
            this.decision(manureTree, { ...params, nutrient: "p-total" }),
            this.decision(manureTree, { ...params, nutrient: "k-total" })
        ]);

        // Crop available values
        let n2 = this.decision(manureTree, { ...params, nutrient: "n-avail" });
        // N/A value
        if (n2 !== "na") {
            // Apply percent or return straight value
            if (total !== 0) {
                n2 = this.percentageCalc(total, n2);
            }
        }
        const cropAvailValues = this.processNutrients(amount, [
            n2,
            this.decision(manureTree, { ...params, nutrient: phosphorous }),
            this.decision(manureTree, { ...params, nutrient: potassium })
        ]);

        return [totalValues, cropAvailValues];
    }

    private processNutrients(amount, nutrients) {
        const nutrientsArray: number[] = [];
        for (const nutrientIndex in nutrients) {
            if (!isNaN(nutrients[nutrientIndex])) {
                nutrientsArray.push(amount * nutrients[nutrientIndex]);
            }
        }
        return nutrientsArray;
    }
    private percentageCalc(value: number, percentage: number) {
        return (value / 100) * percentage;
    }

    // Searches through dataset tree with specified parameters
    private decision(sourceTree, params) {
        function getBranch(tree, choice) {
            // If a default is found in branch, store it in this
            let defaultChoice;
            // Loop through current depth choices
            for (const index in tree.choices) {
                // Find correct choice node
                if (tree.choices[index].choice === choice) {
                    // Check if final number or another layer
                    if (typeof tree.choices[index].value === "object") {
                        return getBranch(
                            tree.choices[index].value,
                            params[tree.choices[index].value.decision]
                        );
                    } else {
                        return tree.choices[index].value;
                    }
                    // If a default choice is encountered, store it just incase
                } else if (tree.choices[index].choice === "default") {
                    if (typeof tree.choices[index].value === "object") {
                        defaultChoice = getBranch(
                            tree.choices[index].value,
                            params[tree.choices[index].value.decision]
                        );
                    } else {
                        defaultChoice = tree.choices[index].value;
                    }
                }
            }
            // If the exact value was not found and a default was found
            if (defaultChoice) {
                console.log(
                    `CalcCore.decision(): Cannot find '${choice}' but found default`,
                    defaultChoice
                );
                return defaultChoice;
                // Nothing was found!
            } else {
                console.log(
                    `CalcCore.decision(): Cannot find '${choice}' no default found - data missing!`
                );
            }
        }
        // Start recursive search using first tree decision
        const end = getBranch(sourceTree, params[sourceTree.decision]);
        return end;
    }
    private isPreviousCropGrass(crop) {
        switch (crop) {
            case "grass-low-n":
            case "grass-high-n":
            case "grass-other":
                return true;

            default:
                return false;
        }
    }

    private isCropArable(crop) {
        if (crop === "grass-cut" || crop === "grass-grazed") {
            return false;
        } else {
            return true;
        }
    }

    private grasslandModifier(soil, recentlyGrownGrass) {
        if (recentlyGrownGrass) {
            return this.grasslandHighSNS;
        } else if (soil === "sandyshallow") {
            return this.grasslandLowSNS;
        } else {
            return this.grasslandMedSNS;
        }
    }

    private snsSearch(tree, params, regularlyManure) {
        // do sns lookup on tree with params
        let sns = this.decision(tree, params);
        // If regularlyManure is true and the sns value is less than 6 (max) then add one
        if (regularlyManure && sns < 6) {
            sns++;
        }
        return sns;
    }
}

export default new CalculatorStore();
// https://mobx.js.org/best/store.html
//
// https://github.com/gothinkster/react-mobx-realworld-example-app/tree/master/src/stores
