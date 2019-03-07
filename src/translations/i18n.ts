import i18n from "i18next";
// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector

i18n.init({
    fallbackLng: "en",
    // the translations
    // realworld load that via xhr or bundle those using webpack
    resources: {
        en: {
            common: {
                introduction: "Manage your muck with the Farm Crap App",
                "the-farm-crap-app-pro": "Farm Crap App Pro",

                title: "The Farm Crap App: Pro Edition",
                "splash-about": "Manage your muck with the Farm Crap App",
                "splash-blurb":
                    "Developed by <a href='http://fo.am/kernow'>FoAM Kernow</a> on behalf of the <a href='www.swarmhub.co.uk'>SWARM Knowledge Hub</a>, a Rural Development Programme for England (RDPE) initiative managed by <a href='http://www.duchy.ac.uk/'>Duchy College Rural Business School</a>, in partnership with Rothamsted Research North Wyke.",
                "splash-discl":
                    "The Farm Crap App offers information for guidance purposes only and is not intended to amount to professional advice or opinion. FoAM Kernow, Duchy College, and Rothamsted Research North Wyke cannot be held responsible for any losses or damage resulting from the use of information provided by this app.",
                "splash-start": "Get Started!",

                "choose-units": "Choose units",
                calculator: "Calculator",
                email: "Email export",
                about: "About",
                back: "Back",
                "field-back": "Back",
                done: "Done",
                save: "Save",
                cancel: "Cancel",

                "crap-calculator": "Crap Calculator",
                season: "Season",
                quality: "Quality",
                "total-availible": "Total in manure",
                "crop-availible": "Crop available nutrients (Total in manure)",
                "crop-availible-event": "Crop available nutrients",
                "nutrient-n-metric": "N Kg/ha",
                "nutrient-p-metric":
                    "P<sub><small>2</small></sub>O<sub><small>5</small></sub> Kg/ha",
                "nutrient-k-metric": "K<sub><small>2</small></sub>O Kg/ha",
                "nutrient-n-imperial": "N units/acre",
                "nutrient-p-imperial":
                    "P<sub><small>2</small></sub>O<sub><small>5</small></sub> units/acre",
                "nutrient-k-imperial":
                    "K<sub><small>2</small></sub>O units/acre",
                "cost-saving": "Fertiliser Savings",

                "field-calc-blurb": "Enter new crap spreading event",
                date: "Set date",

                "report-type": "Manure type",
                "report-date": "Date",
                "report-amount": "Application rate",
                "report-quality": "Quality",
                "report-application": "Application type",
                "report-season": "Season",
                "report-crop": "Crop",
                "report-soil": "Soil",
                "report-size": "Size",

                "soil-type": "Soil type",
                "crop-type": "Select crop",
                "application-type": "Application type",
                "previous-crop-type": "Previous crop type",
                "field-size": "Field size (hectares)",
                "field-size-i": "Field size (acres)",

                // crop types
                "spring-barley-incorporated-feed":
                    "Spring barley, straw incorporated, feed",
                "spring-barley-incorporated-malt":
                    "Spring barley, straw incorporated, malt",
                "spring-barley-removed-feed":
                    "Spring barley, straw removed, feed",
                "spring-barley-removed-malt":
                    "Spring barley, straw removed, malt",
                "winter-wheat-incorporated-feed":
                    "Winter wheat, straw incorporated, feed",
                "winter-wheat-incorporated-mill":
                    "Winter wheat, straw incorporated, mill",
                "winter-wheat-removed-feed":
                    "Winter wheat, straw removed, feed",
                "winter-wheat-removed-mill":
                    "Winter wheat, straw removed, mill",
                "grass-cut": "Grass cut", // (yield 6-8k, conc 1.5, stock med)
                "grass-grazed": "Grass grazed", // (yield 6-8k, conc 1.5, stock med)

                // previous crop types
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
                "grass-other": "Any other grass",

                // soil types
                sandyshallow: "Sandy/Shallow",
                peat: "Peat",
                organic: "Organic (10-20% organic matter)",
                mediumshallow: "Medium/Shallow",
                medium: "Medium",
                deepclay: "Deep clay",
                deepsilt: "Deep silt",

                // application types
                surface: "Surface",
                ploughed: "Ploughed",
                "straight-surface": "Straight to surface",
                "straight-ploughed": "Straight and ploughed",
                "stored-spread": "Stored to surface",
                "stored-ploughed": "Stored and ploughed",
                "splash-surface": "Splash plate/surface",
                "splash-incorporated": "Splash plate/incorporated",
                "shoe-bar-spreader": "Trailing shoe/dribble bar/band spreader",
                "shallow-injected": "Shallow injected",

                "regular-organic": "Do you regularly add organic manures?",
                yes: "Yes",
                no: "No",
                "grown-grass":
                    "Have you grown grass in the last 3 years (other than previous year)?",

                autumn: "Autumn",
                winter: "Winter",
                spring: "Spring",
                summer: "Summer",

                "fym-cattle": "Cattle",
                "fym-pig": "Pig",
                "fym-sheep": "Sheep",
                "fym-duck": "Duck",
                "fym-horse": "Horse",
                "fym-goat": "Goat",

                layer: "Layer manure",
                broiler: "Broiler litter",
                metric: "Metric",
                imperial: "Imperial",
                DM2: "2% DM (Thin soup)",
                DM6: "6% DM (Thick soup)",
                DM10: "10% DM (Porridge)",
                DM4: "4% DM (Thick soup)",
                DM20: "20% DM",
                DM40: "40% DM",
                DM60: "60% DM",
                DM80: "80% DM",
                green: "Green compost",
                "green-food": "Green and foodwaste",

                fields: "Your fields",
                "list-empty": "Nothing yet",
                "field-name": "Field name",
                delete: "Delete",
                events: "Spreading events",
                "fieldcalc-title": "...",
                "fieldcalc-blurb": "Enter new crap spreading event",
                "date-button": "Set date",
                "date-text": "Date",
                "manure-type": "Manure type",

                cattle: "Cattle Slurry",
                FYM: "Farmyard Manure",
                pig: "Pig Slurry",
                poultry: "Poultry Litter",
                compost: "Compost",
                "custom-manure": "Custom",

                rainfall: "Your farm's rainfall",
                "rain-high": "High (>700mm)",
                "rain-medium": "Medium (600-700mm)",
                "rain-low": "Low (<600mm)",

                "fertiliser-costs": "Your fertiliser costs",
                "costs-blurb":
                    "How much do you pay for your fertiliser? This is used to calculate your cost savings.",
                "n-cost": "N (£ per Kg)",
                "p-cost":
                    "P<sub><small>2</small></sub>O<sub><small>5</small></sub> (£ per Kg)",
                "k-cost": "K<sub><small>2</small></sub>O (£ per Kg)",
                "n-cost-imperial": "N (£ per unit)",
                "p-cost-imperial":
                    "P<sub><small>2</small></sub>O<sub><small>5</small></sub> (£ per unit)",
                "k-cost-imperial": "K<sub><small>2</small></sub>O (£ per unit)",

                // soil tests
                "soil-test-p": "P",
                "soil-test-k": "K",

                "soil-p-0": "0",
                "soil-p-1": "1",
                "soil-p-2": "2",
                "soil-p-3": "3",
                "soil-p-4": "4",

                "soil-k-0": "0",
                "soil-k-1": "1",
                "soil-k-2-": "2-",
                "soil-k-2+": "2+",
                "soil-k-3": "3",
                "soil-k-4": "4",

                "soil-info": "Soil details",
                "crop-info": "Crop details",
                "soil-test": "Results of soil tests (if availible)",
                "soil-supply": "Soil N supply",
                "crop-requirements": "Crop nutrient requirements",

                "custom-manures": "Your manures",
                "manures-blurb": "Here you can add custom manure types",
                "manure-name": "Manure name",
                "manure-n": "N Kg/t content (elemental)",
                "manure-p": "P Kg/t content (elemental)",
                "manure-k": "K Kg/t content (elemental)",

                "delete-are-you-sure": "Are you sure you want to delete this?",

                "still-needed": "Nutrients still needed",

                camera: "Camera",
                "take-photo": "Take photo",
                "load-gallery": "Load gallery",
                gallery: "Gallery",

                export: "Export data as spreadsheet",
                "export-blurb":
                    "Email export all field data as a CSV spreadsheet file",
                "email-button": "Email events as a CSV spreadsheet",

                "send-farm-title": "Send farm to another app",
                "send-farm-blurb":
                    "Email the current farm to someone else, or save it as backup - your data is encrypted, so you need to use a password and tell the other person what it is.",

                "email-farm-button": "Email current farm",
                none: "None",
                "reset-title": "Delete all data",

                "graph-title": "Crop available nutrients added to field",
                "factory-reset": "Factory reset",
                "factory-reset-are-you-sure":
                    "Are you sure? This will permenantly delete everything.",

                expert: "Expert crop select",
                "crop-select": "Expert crop select",

                "crop-category": "Main crop category",
                subtype: "Type",
                silage: "Silage",
                targetyield: "Target yield",
                cut: "Cut",
                "DM4-5": "DM 4-5%",
                "DM7-9": "DM 7-9%",
                "DM9-12": "DM 9-12%",
                "DM12-15+": "DM 12-15+%",
                "DM5-7": "DM 5-7%",
                "DM6-8": "DM 6-8%",
                "DM10-13": "DM 10-13%",

                established: "Established",
                sown: "Sown",
                "summer-autumn": "Summer-autumn",
                clover: "Clover",
                grazed: "Grazed",
                hay: "Hay",
                rye: "Rye",
                grass: "Grass",
                "grass-oilseed": "Grass/Oilseed",
                normal: "Normal",

                "paper-crumble": "Paper crumble",
                "chemical-physical": "Chemical/Physical",
                biological: "Biological",
                "spent-mushroom": "Spent mushroom",
                "water-treatment-cake": "Water treatment cake",
                "food-industry-waste": "Food industry waste",
                dairy: "Dairy",
                "soft-drinks": "Soft drinks",
                brewing: "Brewing",
                general: "General",
                "digestate-food": "Digestate food",
                whole: "Whole",
                "separated-liquor": "Separated liquor",
                "separated-fibre": "Separated fibre",
                "digestate-farm": "Digestate farm",
                biosolid: "Biosolid",
                "digested-cake": "Digested cake",
                "thermally-dried": "Thermally dried",
                "lime-stabilised": "Lime stabilised",
                composted: "Composted",
                crop: "Crop",
                barley: "Barley",
                incorporated: "Incorporated",
                removed: "Removed",
                wholecrop: "Wholecrop",
                feed: "Feed",
                malt: "Malt",
                wheat: "Wheat",
                mill: "Mill",
                application: "Application",
                process: "Process",
                triticale: "Triticale",
                forage: "Forage",
                oat: "Oats",
                maize: "Maize",
                swede: "Swede",
                use: "Use",
                "forage-lifted": "Forage (lifted)",
                "forage-grazed": "Forage (grazed)",
                vegetable: "Vegetable",
                turnip: "Turnip",
                rape: "Oilseed rape",
                linseed: "Linseed",
                "pea-bean": "Pea/Bean",
                "fodder-beet": "Fodder beet",
                "kale-grazed": "Kale (grazed)",
                "brussels-sprout-cabbage": "Brussels sprout/Cabbage",
                subtype1: "Type",
                subtype2: "Type",
                "brussels-sprout": "Brussels sprout",
                "storage-cabbage": "Storage cabbage",
                "head-cabbage-pre-31-dec": "Head cabbage (pre 31 Dec)",
                "head-cabbage-post-31-dec": "Head cabbage (post 31 Dec)",
                "collard-pre-31-dec": "Collard (pre 31 Dec)",
                "collard-post-31-dec": "Collard (post 31 Dec)",
                "cauliflower-calabrese": "Cauliflower/Calabrese",
                "cauliflower-summer-autumn": "Cauliflower (summer/autumn)",
                "cauliflower-winter-hardy-roscoff":
                    "Cauliflower (winter/Hardy Roscoff)",
                seedbed: "Seedbed",
                "top-dressing": "Top dressing",
                calabrese: "Calabrese",
                "lettuce-leafy-salad": "Lettuce (leafy salad)",
                "lettuce-whole-head": "Lettuce (whole head)",
                "lettuce-baby-leaf": "Lettuce (baby leaf)",
                "wild-rocket": "Wild rocket",
                "onion-leek": "Onion/Leek",
                "bulb-onion": "Bulb onion",
                "salad-onion": "Salad onion",
                leek: "Leek",
                beetroot: "Beetroot",
                carrot: "Carrot",
                bulb: "Bulb",
                one: "One",
                two: "Two",
                three: "Three",
                four: "Four",
                "growing-season-length": "Growing season length",
                "<60": "<60",
                "60-90": "60-90",
                "90-120": "90-120",
                ">120": ">120",
                potato: "Potato",
                "determinancy-group": "Determinancy group",

                dirtywater: "Dirty water",
                solid: "Separated solid",
                liquidstrainer: "Separated liquid, strainer box",
                liquidweeping: "Separated liquid, weeping wall",
                liquidmechanical: "Separated liquid, mechanical separator",
                liquid: "Separated liquid",

                "farm-name": "Current farm name",
                "farm-button": "Manage your farms",
                "farms-list": "Your farms",
                "your-farms": "Manage your farms",
                "farm-info": "Here you can add and manage multiple farms",

                password: "Password",
                "view-password": "View password",
                "bad-password":
                    "Could not decrypt farm, are you sure this is the correct password?",
                "import-farm": "Import farm",
                "import-blurb":
                    "You have received a farm for the Farm Crapapp - enter the password and click import to add it to your farms",

                "import-new-farm": "Would you like to add the new farm: ",
                "import-existing-farm":
                    "Would you like to update your existing farm: ",
                "bad-file-version":
                    "This file is not compatible with your Farm Crap App",

                "import-report": "Imported farm: ",
                "new-field": "Added new field: ",
                "overwritten-field": "Updated field: ",
                "new-event": "Added new event: ",
                "overwritten-event": "Updated event: ",
                "return-to-app": "Return to farm"
            }
        },
        de: {
            common: {
                title: "Willkommen"
            }
        }
    },
    // have a initial namespace
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
        escapeValue: false // not needed for react
    }
});
export default i18n;
