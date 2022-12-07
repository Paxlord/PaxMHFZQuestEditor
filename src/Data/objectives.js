//Keys are value as Uint32
export const Objectives = {
  0: "None",
  1: "Hunt",
  257: "Capture",
  513: "Slay",
  32772: "Damage",
  98308: "Slay or Damage",
  262144: "Slay All",
  131072: "Slay Total",
  2: "Deliver",
  16388: "Break Part",
  4098: "Deliver Flag",
  16: "Esoteric Action"
}

export const ObjectiveCategory = {
  "Monster": [1, 257, 513, 98308, 262144, 32772],
  "Item": [2, 4098],
  "Numeral": [ 16388],
  "None": [16, 0, 131072]
}

export const ObjectiveNumCategory = {
  "Amount": [1 , 257, 513,  262144, 2,16388, 4098],
  "Damage": [32772, 98308],
  "None": [131072, 16, 0],
}

export const ObjectiveToCategory = (objId) => {

  const categories = [];

  let targetCategory = Object.keys(ObjectiveCategory);
  let amountCategory = Object.keys(ObjectiveNumCategory);

  targetCategory.forEach((category) => {
    let filteredArray = ObjectiveCategory[category].filter((id) => id === objId);
    if(filteredArray.length > 0){
      categories.push(category);
    }
  });

  amountCategory.forEach((category) => {
    let filteredArray = ObjectiveNumCategory[category].filter((id) => id === objId);
    if(filteredArray.length > 0){
      categories.push(category);
    }
  });

  return categories;

}

const GenerateObjectivesOptions = () => {

  let obj_keys = Object.keys(Objectives);
  
  let optionsArray = obj_keys.map((key) => (
    {
      value: key,
      label: Objectives[key]
    }
  ));

  console.log("Options array", optionsArray);

  return optionsArray;

}

export const ObjectivesOptions = GenerateObjectivesOptions();