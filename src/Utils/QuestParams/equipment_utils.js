const ReadEquipment = (dataview, offset) => {

  return{
    piece_id: dataview.getUint16(offset, true),
    deco_1: dataview.getUint16(offset + 2, true),
    deco_2: dataview.getUint16(offset + 4, true),
    deco_3: dataview.getUint16(offset + 6, true),
  }

}

export const ReadEquipmentRestrictions = (dataView) => {

  return{
    legs: ReadEquipment(dataView, 0x11a),
    weapon : ReadEquipment(dataView, 0x122),
    head: ReadEquipment(dataView, 0x12a),
    chest: ReadEquipment(dataView, 0x132),
    arms: ReadEquipment(dataView, 0x13a),
    waist: ReadEquipment(dataView, 0x142),
    unk_equip: dataView.getUint32(0x14a, true)
  }

} 

