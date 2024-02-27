import { immu_write_ubyte } from "../immutable_dataview";

const ReadMonsterVariant = (dataview, offset) => {
  return dataview.getUint8(offset);
};

export const ReadMonsterVariant1 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x151);
};

export const ReadMonsterVariant2 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x152);
};

export const ReadMonsterVariant3 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x176);
};

export const ReadMonsterVariant4 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x177);
};

export const ReadMonsterVariant5 = (dataview) => {
  return ReadMonsterVariant(dataview, 0x178);
};

export const WriteMonsterVariants = (
  dataview,
  variant1,
  variant2,
  variant3,
  variant4,
  variant5
) => {
  let dv = immu_write_ubyte(dataview, 0x151, variant1);
  dv = immu_write_ubyte(dv, 0x152, variant2);
  dv = immu_write_ubyte(dv, 0x176, variant3);
  dv = immu_write_ubyte(dv, 0x177, variant4);
  dv = immu_write_ubyte(dv, 0x178, variant5);
  return dv;
};

export const ReadRewardVariant = (dataview) => {
  return ReadMonsterVariant(dataview, 0x150);
};

export const WriteRewardVariant = (dataview, variant) => {
  let dv = immu_write_ubyte(dataview, 0x150, variant);
  return dv;
};
