import { immu_write_ushort } from "../immutable_dataview";

// SupplyItem struct (4 bytes):
// offset 0: itemId   (u16) — 0 = empty slot
// offset 2: quantity (u16)
//
// Three fixed-size sections from supplyBoxPtr (header 0x08):
//   Main  — 24 items at ptr + 0x00
//   Sub A —  8 items at ptr + 0x60
//   Sub B —  8 items at ptr + 0x80

const SUPPLY_ITEM_SIZE = 4;

const SECTIONS = {
  main: { offset: 0x00, count: 24 },
  subA: { offset: 0x60, count: 8 },
  subB: { offset: 0x80, count: 8 },
};

const ReadSupplySection = (dataview, basePtr, sectionOffset, count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const offset = basePtr + sectionOffset + i * SUPPLY_ITEM_SIZE;
    if (offset + SUPPLY_ITEM_SIZE > dataview.byteLength) break;
    items.push({
      itemId: dataview.getUint16(offset, true),
      quantity: dataview.getUint16(offset + 2, true),
    });
  }
  return items;
};

const WriteSupplySection = (dataview, basePtr, sectionOffset, items) => {
  let dv = dataview;
  items.forEach((item, idx) => {
    const offset = basePtr + sectionOffset + idx * SUPPLY_ITEM_SIZE;
    if (offset + SUPPLY_ITEM_SIZE > dv.byteLength) return;
    dv = immu_write_ushort(dv, offset, item.itemId);
    dv = immu_write_ushort(dv, offset + 2, item.quantity);
  });
  return dv;
};

export const ReadSupplyBox = (dataview) => {
  const supplyBoxPtr = dataview.getUint32(0x08, true);
  if (supplyBoxPtr === 0 || supplyBoxPtr >= dataview.byteLength) return null;

  return {
    ptr: supplyBoxPtr,
    main: ReadSupplySection(dataview, supplyBoxPtr, SECTIONS.main.offset, SECTIONS.main.count),
    subA: ReadSupplySection(dataview, supplyBoxPtr, SECTIONS.subA.offset, SECTIONS.subA.count),
    subB: ReadSupplySection(dataview, supplyBoxPtr, SECTIONS.subB.offset, SECTIONS.subB.count),
  };
};

export const WriteSupplyBox = (dataview, supplyBox) => {
  if (!supplyBox?.ptr) return dataview;
  let dv = WriteSupplySection(dataview, supplyBox.ptr, SECTIONS.main.offset, supplyBox.main);
  dv = WriteSupplySection(dv, supplyBox.ptr, SECTIONS.subA.offset, supplyBox.subA);
  dv = WriteSupplySection(dv, supplyBox.ptr, SECTIONS.subB.offset, supplyBox.subB);
  return dv;
};
