import { immu_write_uint32, immu_write_ushort } from "../immutable_dataview";

const ReadEquipment = (dataview, offset) => {
  return {
    piece_id: dataview.getUint16(offset, true),
    deco_1: dataview.getUint16(offset + 2, true),
    deco_2: dataview.getUint16(offset + 4, true),
    deco_3: dataview.getUint16(offset + 6, true),
  };
};

const WriteEquipment = (dataview, offset, piece) => {
  let dv = dataview;
  let cur_offset = offset;

  dv = immu_write_ushort(dv, cur_offset, piece.piece_id);
  cur_offset += 2;

  dv = immu_write_ushort(dv, cur_offset, piece.deco_1);
  cur_offset += 2;

  dv = immu_write_ushort(dv, cur_offset, piece.deco_2);
  cur_offset += 2;

  dv = immu_write_ushort(dv, cur_offset, piece.deco_3);
  cur_offset += 2;

  return dv;
};

export const WriteEquipments = (dataView, equipments) => {
  let dv = dataView;
  dv = WriteEquipment(dv, 0x11c, equipments.legs);
  dv = WriteEquipment(dv, 0x124, equipments.weapon);
  dv = WriteEquipment(dv, 0x12c, equipments.head);
  dv = WriteEquipment(dv, 0x134, equipments.chest);
  dv = WriteEquipment(dv, 0x13c, equipments.arms);
  dv = WriteEquipment(dv, 0x144, equipments.waist);
  dv = immu_write_uint32(dv, 0x14c, equipments.unk_equip);
  return dv;
};

export const ReadEquipmentRestrictions = (dataView) => {
  return {
    legs: ReadEquipment(dataView, 0x11c),
    weapon: ReadEquipment(dataView, 0x124),
    head: ReadEquipment(dataView, 0x12c),
    chest: ReadEquipment(dataView, 0x134),
    arms: ReadEquipment(dataView, 0x13c),
    waist: ReadEquipment(dataView, 0x144),
    unk_equip: dataView.getUint32(0x14c, true),
  };
};
