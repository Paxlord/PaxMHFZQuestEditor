export const Counters={
  8:"Festa Winners",
  9:"Campaign",
  13:"VS",
  16:" Ravi (Normal)",
  18:"HR Event",
  22:"Ravi (Violent)",
  24:"Series ",
  26:"Daily",
  28:"G Event",
  30:"G Daily",
  31:"G Urgent",
  38:"HR Exotic ",
  39:"G Exotic ",
  40:"Ravi (Berserk)",
  43:"Superior/Zenith?",
  46:"Interception",
  47:"Interception Branch",
  48:"Interception Urgent",
  50:"Ravi (Extreme)",
  51:"Ravi (Small Berserk)",
  52:"Superior",
  53:"G Superier ",
  54:"G Armor",
}

const GenerateCountersOptions = () => {
  let options = Object.keys(Counters).map((key) => (
    {
      value: key,
      label: Counters[key]
    }
  ))
  return options;
}

export const CountersOptions = GenerateCountersOptions();
