import { immu_write_ubyte } from "../immutable_dataview";

const ReadFlag = (dataview, offset, labelArray) => {
  let flagSet = dataview.getUint8(offset);

  let flagBits = flagSet.toString(2).split("").reverse().join("");

  let flagArray = [];

  let bitPadding = 8 - flagBits.length;
  flagBits += "0".repeat(bitPadding);

  console.log("flag string", flagBits);

  for (let i = 0; i < flagBits.length; i++) {
    let currentFlag = flagBits.charAt(i);
    flagArray.push({
      label: labelArray[i].label,
      flag: currentFlag === "1" ? true : false,
      display: labelArray[i].display,
    });
  }

  return flagArray;
};

const WriteFlags = (dataview, offset, flags) => {
  let bigEndianFlags = structuredClone(flags).reverse();
  let flagToInt = bigEndianFlags.reduce((acc, value) => {
    return (acc << 1) + value.flag;
  }, 0);

  return immu_write_ubyte(dataview, offset, flagToInt);
};

export const WriteQuestFlags1 = (dataview, flags) => {
  return WriteFlags(dataview, 0x157, flags);
};

export const WriteQuestFlags2 = (dataview, flags) => {
  return WriteFlags(dataview, 0x158, flags);
};

export const WriteQuestFlags3 = (dataview, flags) => {
  return WriteFlags(dataview, 0x159, flags);
};

export const ReadQuestFlags1 = (dataview) => {
  let labelArray = [
    { label: "Hiden", display: true },
    { label: "Fix HC", display: true },
    { label: "HC to UL", display: true },
    { label: "G Rank", display: true },
    { label: "SR", display: false },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
    { label: "UL Fixed", display: false },
  ];

  return ReadFlag(dataview, 0x157, labelArray);
};

export const ReadQuestFlags2 = (dataview) => {
  let labelArray = [
    { label: "Low Conquest", display: false },
    { label: "No Halk Pots", display: true },
    { label: "No Cuff", display: true },
    { label: "Timer", display: false },
    { label: "No Act. Feat.", display: false },
    { label: "Fixed Diff.", display: false },
    { label: "High Conquest", display: false },
    { label: "Road", display: false },
  ];

  return ReadFlag(dataview, 0x158, labelArray);
};

export const ReadQuestFlags3 = (dataview) => {
  let labelArray = [
    { label: "No Reward Skills", display: false },
    { label: "GSR to GR", display: true },
    { label: "No Easy Drink", display: false },
    { label: "No GP skills", display: true },
    { label: "Zenith", display: true },
    { label: "Interception", display: true },
    { label: "Unk", display: false },
    { label: "No Sigils", display: false },
  ];

  return ReadFlag(dataview, 0x159, labelArray);
};

export const ReadAllFlags = (dataview) => {
  return {
    reward_flag: dataview.getUint8(0x150),
    monster_flag1: dataview.getUint8(0x151),
    monster_flag2: dataview.getUint8(0x152),
    map_flag: dataview.getUint8(0x153),
    item_req_type: dataview.getUint16(0x154),
    item_req_count: dataview.getUint8(0x156),
    quest_flag1: dataview.getUint8(0x157),
    quest_flag2: dataview.getUint8(0x158),
    quest_flag3: dataview.getUint8(0x159),
    quest_flag4: dataview.getUint8(0x15a),
    unk_flag: dataview.getUint8(0x15b),
  };
};

export const ReadMapVariant = (dataview) => {
  return dataview.getUint8(0x153);
};
