import { immu_write_ushort } from "../immutable_dataview";

export const ReadMonsterParams = (dataview) => {

  const baseOffset = 0x44;

  return {
    size: dataview.getUint16(baseOffset, true),
    wdth: dataview.getUint16(baseOffset+2, true),
    difficulty: dataview.getUint16(baseOffset+4, true),
  }

} 

export const WriteMonsterParams = (dataview, monterParams) => {
  let newDv = immu_write_ushort(dataview, 0x44, monterParams.size);
  newDv = immu_write_ushort(newDv, 0x46, monterParams.wdth);
  newDv = immu_write_ushort(newDv, 0x48, monterParams.difficulty);

  return newDv;
}