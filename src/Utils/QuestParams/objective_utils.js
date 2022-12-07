import { ObjectiveToCategory } from "../../Data/objectives";

const ReadObjective = (dataview, offset) => {

  let targetOffset = offset+4;
  let targetAmount = offset+6;

  return {
    objType: dataview.getUint32(offset, true),
    objTarget: dataview.getUint16(targetOffset, true),
    objAmount: dataview.getUint16(targetAmount, true),
    categories: ObjectiveToCategory(dataview.getUint32(offset, true)),
  };

}

export const ReadMainObjective = (dataview) => {
  return ReadObjective(dataview, 0xf0);
}

export const ReadSubAObjective = (dataview) => {
  return ReadObjective(dataview, 0xf8);
}

export const ReadSubBObjective = (dataview) => {
  return ReadObjective(dataview, 0x100);
}