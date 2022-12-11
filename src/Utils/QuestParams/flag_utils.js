const ReadFlag = (dataview, offset, labelArray) => {
  
  let flagSet = dataview.getUint8(offset);

  
  let flagBits = flagSet.toString(2).split("").reverse().join("");
  
  let flagArray = [];
  
  
  let bitPadding = 8 - flagBits.length;
  flagBits += '0'.repeat(bitPadding);
  
  console.log("flag string", flagBits);

  for(let i = 0; i<flagBits.length; i++){

    let currentFlag = flagBits.charAt(i);
    flagArray.push({
      label: labelArray[i].label,
      flag: (currentFlag === '1')?true:false,
      display: labelArray[i].display
    });
  }

  return flagArray;

}

export const ReadQuestFlags1 = (dataview) => {

  let labelArray = [
    { label: "Hiden", display: true },
    { label: "Fix HC", display: true },
    { label: "HC to UL", display: true },
    { label: "G Rank", display: true },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
  ]

  return ReadFlag(dataview, 0x157, labelArray);

}

export const ReadQuestFlags2 = (dataview) => {

  let labelArray = [
    { label: "Unk", display: false },
    { label: "No Halk Pots", display: true },
    { label: "No Halk/Poogie", display: true },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
  ]

  return ReadFlag(dataview, 0x158, labelArray);

}

export const ReadQuestFlags3 = (dataview) => {

  let labelArray = [
    { label: "Unk", display: false },
    { label: "GSR to GR", display: true },
    { label: "Unk", display: false },
    { label: "Musou", display: true },
    { label: "Zenith", display: true },
    { label: "Interception", display: true },
    { label: "Unk", display: false },
    { label: "Unk", display: false },
  ]

  return ReadFlag(dataview, 0x159, labelArray);

}