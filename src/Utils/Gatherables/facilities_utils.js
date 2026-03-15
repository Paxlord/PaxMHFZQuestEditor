import {
  immu_write_float32,
  immu_write_uint32,
  immu_write_ushort,
} from "../immutable_dataview";

// facPoint struct (24 bytes):
// offset  0: padding[2]  (u8[2])
// offset  2: type        (u16)
// offset  4: xPos        (f32)
// offset  8: yPos        (f32)
// offset 12: zPos        (f32)
// offset 16: range       (f32)
// offset 20: kn4         (u16)
// offset 22: padding[2]  (u8[2])
// Sentinel: xPos (offset+4) == -1.0f => getUint32(offset+4, LE) === 0xBF800000
// Pattern: while(read_unsigned($+4,4) != 0xBF800000)
const FAC_POINT_SIZE = 24;
const FAC_SENTINEL = 0xbf800000;

// genQuestProp.quantity.area1zones at offset 0x7C
const AREA1_ZONES_OFFSET = 0x7c;

const ReadFacPoint = (dataview, offset) => ({
  type: dataview.getUint16(offset + 2, true),
  xPos: dataview.getFloat32(offset + 4, true),
  yPos: dataview.getFloat32(offset + 8, true),
  zPos: dataview.getFloat32(offset + 12, true),
  range: dataview.getFloat32(offset + 16, true),
  kn4: dataview.getUint16(offset + 20, true),
});

const WriteFacPoint = (dataview, offset, point) => {
  let dv = immu_write_ushort(dataview, offset + 2, point.type);
  dv = immu_write_float32(dv, offset + 4, point.xPos);
  dv = immu_write_float32(dv, offset + 8, point.yPos);
  dv = immu_write_float32(dv, offset + 12, point.zPos);
  dv = immu_write_float32(dv, offset + 16, point.range);
  dv = immu_write_ushort(dv, offset + 20, point.kn4);
  return dv;
};

export const ReadAreaFacilities = (dataview) => {
  const facPtr = dataview.getUint32(0x2c, true);
  if (facPtr === 0 || facPtr >= dataview.byteLength) return [];

  const areaCount = dataview.getUint8(AREA1_ZONES_OFFSET);
  if (areaCount === 0 || areaCount > 16) return [];

  const zones = [];

  for (let i = 0; i < areaCount; i++) {
    const zonePtr = dataview.getUint32(facPtr + i * 4, true);
    const points = [];

    if (zonePtr !== 0 && zonePtr < dataview.byteLength) {
      let offset = zonePtr;
      while (offset + FAC_POINT_SIZE <= dataview.byteLength) {
        if (dataview.getUint32(offset + 4, true) === FAC_SENTINEL) break;
        points.push(ReadFacPoint(dataview, offset));
        offset += FAC_POINT_SIZE;
      }
    }

    zones.push({ zoneIndex: i, zonePtr, points });
  }

  return zones;
};

export const WriteAreaFacilities = (dataview, zones) => {
  let dv = dataview;

  zones.forEach((zone) => {
    if (zone.zonePtr === 0) return;

    zone.points.forEach((point, idx) => {
      const offset = zone.zonePtr + idx * FAC_POINT_SIZE;
      dv = WriteFacPoint(dv, offset, point);
    });

    // Write sentinel: set xPos field (offset+4) to -1.0f
    const sentinelOffset = zone.zonePtr + zone.points.length * FAC_POINT_SIZE;
    if (sentinelOffset + 4 + 4 <= dv.byteLength) {
      dv = immu_write_uint32(dv, sentinelOffset + 4, FAC_SENTINEL);
    }
  });

  return dv;
};
