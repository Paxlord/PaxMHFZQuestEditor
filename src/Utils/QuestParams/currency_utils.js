import { immu_write_uint32 } from "../immutable_dataview";

const ReadCurrencies = (dataview, offsetZenny, offsetPoints) => {

  return{
    pointReward: dataview.getUint32(offsetPoints, true),
    zennyReward: dataview.getUint32(offsetZenny, true)
  }

}

export const ReadFee = (dataview) => {
  return dataview.getUint32(0xcc, true);
}

const WriteZenny = (dataview, offsetZenny, valueZenny) => {
  let tmpDV = immu_write_uint32(dataview, offsetZenny, valueZenny);
  return tmpDV;
}

const WritePoints = (dataview, offsetPoints, valuePoints) => {
  let tmpDV = immu_write_uint32(dataview, offsetPoints, valuePoints);
  return tmpDV;
}

export const WriteMainCurrency = (dataview, currencyObj) => {
  let tmpDV = WriteZenny(dataview, 0xd0, currencyObj.zennyReward);
  tmpDV = WritePoints(tmpDV, 0x4c, currencyObj.pointReward);
  return tmpDV;
}

export const WriteSubACurrency = (dataview, currencyObj) => {
  let tmpDV = WriteZenny(dataview, 0xd8, currencyObj.zennyReward);
  tmpDV = WritePoints(tmpDV, 0x54, currencyObj.pointReward);
  return tmpDV;
}

export const WriteSubBCurrency = (dataview, currencyObj) => {
  let tmpDV = WriteZenny(dataview, 0xdc, currencyObj.zennyReward);
  tmpDV = WritePoints(tmpDV, 0x58, currencyObj.pointReward);
  return tmpDV;
}

export const WriteQuestFee = (dataview, fee) => {
  let tmpDV = immu_write_uint32(dataview, 0xcc, fee);
  return tmpDV;
}

export const WriteDeathCount = (dataview, deathCount) => {
  let tmpDV = immu_write_uint32(dataview, 0xd4, deathCount);
  return tmpDV;
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