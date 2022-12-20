import { immu_write_ubyte } from "../immutable_dataview";

const ReadMonsterVariant = (dataview, offset) => {
  return dataview.getUint8(offset);
}

export const ReadMonsterVariant1 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x151);
}

export const ReadMonsterVariant2 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x152);
}

export const WriteMonsterVariants = (dataview, variant1, variant2) => {
  let dv = immu_write_ubyte(dataview, 0x151, variant1);
  dv = immu_write_ubyte(dv, 0x152, variant2);
  return dv;
}

export const ReadRewardVariant = (dataview) => {
  return ReadMonsterVariant(dataview, 0x150);
}

export const WriteRewardVariant = (dataview , variant) => {
  let dv =immu_write_ubyte(dataview, 0x150, variant);
  return dv;
}