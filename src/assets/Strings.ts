export default class Strings {
    public cropType = {
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
    public crops = {
        cereals: "Cereals",
        oilseed: "Oilseed rape",
        potatoes: "Potatoes",
        sugarbeet: "Sugar beet",
        peas: "Peas",
        beans: "Beans",
        "low-n-veg": "Low N veg",
        "medium-n-veg": "Medium N veg",
        forage: "Forage crops (cut)",
        uncropped: "Uncropped land",
        "grass-low-n": "Grass (low N/1 or more cuts)",
        "grass-high-n": "Grass (3-5yr, high N, grazed)",
        "grass-other": "Any other grass"
    };
    public soilType = {
        sandyshallow: "Sandy/Shallow",
        peat: "Peat",
        organic: "Organic (10-20% organic matter)",
        mediumshallow: "Medium/Shallow",
        medium: "Medium",
        deepclay: "Deep clay",
        deepsilt: "Deep silt"
    };
    public soiltestP = {
        "soil-p-0": "0",
        "soil-p-1": "1",
        "soil-p-2": "2",
        "soil-p-3": "3"
    };

    public soiltestK = {
        "soil-k-0": "0",
        "soil-k-1": "1",
        "soil-k-2": "2",
        "soil-k-2+": "2+",
        "soil-k-3": "3"
    };

    public yesno = {
        no: "No",
        yes: "Yes"
    };
    public manureTypes = {
        cattle: "Cattle Slurry",
        fym: "Farmyard Manure",
        pig: "Pig Slurry",
        poultry: "Poultry Litter",
        compost: "Compost",
        "paper-crumble": "Paper crumble",
        "spent-mushroom": "Spent mushroom",
        "water-treatment-cake": "Water treatment cake",
        "food-industry-waste": "Food industry waste",
        "digestate-food": "Digestate food",
        "digestate-farm": "Digestate farm",
        biosolid: "Spent mushroom",
        custom: "Custom"
    };
    public season = {
        autumn: "Autumn",
        winter: "Winter",
        spring: "Spring",
        summer: "Summer"
    };
}
