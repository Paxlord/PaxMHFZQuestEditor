import { immu_write_ushort } from "../immutable_dataview";

// GatherItem struct (4 bytes):
// offset 0: rate   (u16) — drop percentage
// offset 2: itemId (u16) — item identifier
// Sentinel: rate == 0xFFFF (signed -1)
const GATHER_ITEM_SIZE = 4;
const GATHER_ITEM_SENTINEL = 0xffff;

// gatheringTablesPtr at header offset 0x38
// gatheringTablesQty at genQuestProp offset 0x78 (absolute)
//   genQuestProp base = 0x44 (area1zones=0x7C is at relative 0x38)
//   gatheringTablesQty at relative 0x34 → absolute 0x78
const GATHER_TABLES_PTR_OFFSET = 0x38;
const GATHER_TABLES_QTY_OFFSET = 0x78;

const ReadGatherItem = (dataview, offset) => ({
  rate: dataview.getUint16(offset, true),
  itemId: dataview.getUint16(offset + 2, true),
});

const WriteGatherItem = (dataview, offset, item) => {
  let dv = immu_write_ushort(dataview, offset, item.rate);
  dv = immu_write_ushort(dv, offset + 2, item.itemId);
  return dv;
};

export const ReadGatheringTables = (dataview) => {
  const tablesPtr = dataview.getUint32(GATHER_TABLES_PTR_OFFSET, true);
  if (tablesPtr === 0 || tablesPtr >= dataview.byteLength) return [];

  const tableCount = dataview.getUint16(GATHER_TABLES_QTY_OFFSET, true);
  if (tableCount === 0 || tableCount > 256) return [];

  const tables = [];

  for (let i = 0; i < tableCount; i++) {
    const tablePtr = dataview.getUint32(tablesPtr + i * 4, true);
    const items = [];

    if (tablePtr !== 0 && tablePtr < dataview.byteLength) {
      let offset = tablePtr;
      while (offset + GATHER_ITEM_SIZE <= dataview.byteLength) {
        const rate = dataview.getUint16(offset, true);
        if (rate === GATHER_ITEM_SENTINEL) break;
        items.push(ReadGatherItem(dataview, offset));
        offset += GATHER_ITEM_SIZE;
      }
    }

    tables.push({ tableIndex: i, tablePtr, items });
  }

  return tables;
};

export const WriteGatheringTables = (dataview, tables) => {
  let dv = dataview;

  tables.forEach((table) => {
    if (table.tablePtr === 0) return;

    table.items.forEach((item, idx) => {
      const offset = table.tablePtr + idx * GATHER_ITEM_SIZE;
      dv = WriteGatherItem(dv, offset, item);
    });

    // Write sentinel after last item
    const sentinelOffset = table.tablePtr + table.items.length * GATHER_ITEM_SIZE;
    if (sentinelOffset + 2 <= dv.byteLength) {
      dv = immu_write_ushort(dv, sentinelOffset, GATHER_ITEM_SENTINEL);
    }
  });

  return dv;
};
