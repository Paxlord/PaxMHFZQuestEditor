import {
  immu_write_float32,
  immu_write_uint32,
  immu_write_ushort,
} from "../immutable_dataview";

// -1.0f in little-endian bytes: 00 00 80 BF → getUint32(LE) = 0xBF800000
// Pattern: if (read_unsigned($,4) == 0xBF800000) return;
const GATHER_SENTINEL = 0xbf800000;
const GATHER_POINT_SIZE = 24;
const MAX_GATHER_POINTS_PER_ZONE = 4;

// genQuestProp.quantity.area1zones is at offset 0x7C
const AREA1_ZONES_OFFSET = 0x7c;

const ReadGatheringPoint = (dataview, offset) => {
  return {
    xPos: dataview.getFloat32(offset, true),
    yPos: dataview.getFloat32(offset + 4, true),
    zPos: dataview.getFloat32(offset + 8, true),
    scope: dataview.getFloat32(offset + 12, true),
    gatheringID: dataview.getInt16(offset + 16, true),
    maxCount: dataview.getInt16(offset + 18, true),
    unk: dataview.getUint16(offset + 20, true),
    minCount: dataview.getInt16(offset + 22, true),
    fileOffset: offset,
  };
};

const WriteGatheringPoint = (dataview, offset, point) => {
  let dv = immu_write_float32(dataview, offset, point.xPos);
  dv = immu_write_float32(dv, offset + 4, point.yPos);
  dv = immu_write_float32(dv, offset + 8, point.zPos);
  dv = immu_write_float32(dv, offset + 12, point.scope);
  // int16 via ushort (two's complement same bits)
  dv = immu_write_ushort(dv, offset + 16, point.gatheringID & 0xffff);
  dv = immu_write_ushort(dv, offset + 18, point.maxCount & 0xffff);
  dv = immu_write_ushort(dv, offset + 20, point.unk);
  dv = immu_write_ushort(dv, offset + 22, point.minCount & 0xffff);
  return dv;
};

export const ReadGatheringPoints = (dataview) => {
  let gatherPointsAddr = dataview.getUint32(0x28, true);
  if (gatherPointsAddr === 0 || gatherPointsAddr >= dataview.byteLength)
    return [];

  let areaCount = dataview.getUint8(AREA1_ZONES_OFFSET);
  if (areaCount === 0 || areaCount > 16) return [];

  let zones = [];

  for (let i = 0; i < areaCount; i++) {
    let zonePtr = dataview.getUint32(gatherPointsAddr + i * 4, true);
    let points = [];

    if (zonePtr !== 0 && zonePtr < dataview.byteLength) {
      let offset = zonePtr;
      for (let j = 0; j < MAX_GATHER_POINTS_PER_ZONE; j++) {
        if (offset + GATHER_POINT_SIZE > dataview.byteLength) break;
        if (dataview.getUint32(offset, true) === GATHER_SENTINEL) break;
        points.push(ReadGatheringPoint(dataview, offset));
        offset += GATHER_POINT_SIZE;
      }
    }

    zones.push({ zoneIndex: i, zonePtr, points });
  }

  return zones;
};

export const WriteGatheringPoints = (dataview, zones) => {
  let dv = dataview;

  zones.forEach((zone) => {
    if (zone.zonePtr === 0) return;

    zone.points.forEach((point, idx) => {
      const offset = zone.zonePtr + idx * GATHER_POINT_SIZE;
      dv = WriteGatheringPoint(dv, offset, point);
    });

    const sentinelOffset = zone.zonePtr + zone.points.length * GATHER_POINT_SIZE;
    if (sentinelOffset + 4 <= dv.byteLength) {
      dv = immu_write_uint32(dv, sentinelOffset, GATHER_SENTINEL);
    }
  });

  return dv;
};
