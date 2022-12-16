const ReadCurrencies = (dataview, offsetZenny, offsetPoints) => {

  return{
    pointReward: dataview.getUint32(offsetPoints, true),
    zennyReward: dataview.getUint32(offsetZenny, true)
  }

}

export const ReadFee = (dataview) => {
  return dataview.getUint32(0xcc, true);
}

export const ReadMainObjCurrency = (dataview) => {
  return ReadCurrencies(dataview, 0xd0, 0x4c);
}

export const ReadSubACurrency = (dataview) => {
  return ReadCurrencies(dataview, 0xd8, 0x54);
}

export const ReadSubBCurrency = (dataview) => {
  return ReadCurrencies(dataview, 0xdc, 0x58);
}

export const ReadQuestFee = (dataview) => {
  return dataview.getUint32(0xcc, true);
}

export const ReadDeathCount = (dataview) => {
  return dataview.getUint32(0xd4, true);
}