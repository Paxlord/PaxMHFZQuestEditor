import { ObjectiveToCategory } from "../../Data/objectives";
import { immu_write_uint32, immu_write_ushort } from "../immutable_dataview";

const ReadObjective = (dataview, offset) => {
  let targetOffset = offset + 4;
  let targetAmount = offset + 6;

  console.log("reading objectives");

  return {
    objType: dataview.getUint32(offset, true),
    objTarget: dataview.getUint16(targetOffset, true),
    objAmount: dataview.getUint16(targetAmount, true),
    categories: ObjectiveToCategory(dataview.getUint32(offset, true)),
  };
};

const WriteObjective = (dataview, offset, objective) => {
  let targetOffset = offset + 4;
  let amountOffset = offset + 6;

  let tmpDv = immu_write_uint32(dataview, offset, objective.objType);
  tmpDv = immu_write_ushort(dataview, targetOffset, objective.objTarget);
  tmpDv = immu_write_ushort(dataview, amountOffset, objective.objAmount);

  return tmpDv;
};

export const ReadMainObjective = (dataview) => {
  return ReadObjective(dataview, 0xf0);
};

export const ReadSubAObjective = (dataview) => {
  return ReadObjective(dataview, 0xf8);
};

export const ReadSubBObjective = (dataview) => {
  return ReadObjective(dataview, 0x100);
};

export const ReadMandatoryFlag = (dataview) => {
  return dataview.getUint16(0x108, true);
};

export const WriteMainObjective = (dataview, objective) => {
  return WriteObjective(dataview, 0xf0, objective);
};

export const WriteSubAObjective = (dataview, objective) => {
  return WriteObjective(dataview, 0xf8, objective);
};

export const WriteSubBObjective = (dataview, objective) => {
  return WriteObjective(dataview, 0x100, objective);
};
