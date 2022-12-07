export const Difficulties = {           
  1: "Low rank",
  2: "Low rank",
  3: "Low rank",
  4: "Low rank",
  5: "Low rank",
  6: "Low rank",
  7: "Low rank",
  8: "Low rank",
  9: "Low rank",
  10: "Low rank",
  11: "Low rank/High rank",
  12: "High rank",
  13: "High rank",
  14: "High rank",
  15: "High rank",
  16: "High rank",
  17: "High rank",
  18: "High rank",
  19: "High rank",
  20: "High rank",
  26: "HR5",
  31: "HR5",
  42: "HR5",
  53: "G Rank",
  54: "Musou 1",
  55: "Musou 2",
  64: "Z1",
  65: "Z2",
  66: "Z3",
  67: "Z4",
  71: "Interception",
  72: "Interception",
  73: "Interception"
}

const GenerateDifficultiesOptions = () => {

  let obj_keys = Object.keys(Difficulties);
  
  let optionsArray = obj_keys.map((key) => (
    {
      value: key,
      label: Difficulties[key]
    }
  ));

  return optionsArray;

}

export const DifficultiesOptions = GenerateDifficultiesOptions();