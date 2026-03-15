import {
  immu_write_float32,
  immu_write_uint32,
  immu_write_ushort,
} from "../immutable_dataview";

// ─── floatSet struct (52 bytes) ───────────────────────────────────────────────
// offset  0 : s16  targetStageId
// offset  2 : s16  stageVariant
// offset  4 : f32  thisXPos
// offset  8 : f32  thisYPos
// offset 12 : f32  thisZPos
// offset 16 : f32  transitionBox[5]  (5 × 4 bytes = 20 bytes)
// offset 36 : f32  targetXPos
// offset 40 : f32  targetYPos
// offset 44 : f32  targetZPos
// offset 48 : s16  targetRot0
// offset 50 : s16  targetRot1
// Sentinel: getInt32(offset, LE) === -1  (0xFFFFFFFF)
const FLOAT_SET_SIZE = 52;
const TRANSITION_SENTINEL = 0xffffffff;

// ─── AreaMappings struct (32 bytes) ──────────────────────────────────────────
// offset  0 : f32  areaXPos
// offset  4 : f32  areaZPos
// offset  8 : padding[8]
// offset 16 : f32  baseXPos
// offset 20 : f32  baseZPos
// offset 24 : f32  knPos
// offset 28 : padding[4]
// Count = (areaTransitionsPtr - areaMappingPtr) / 32
const AREA_MAPPINGS_SIZE = 32;

const AREA1_ZONES_OFFSET = 0x7c;

// ─── Read helpers ─────────────────────────────────────────────────────────────
const ReadFloatSet = (dataview, offset) => ({
  targetStageId: dataview.getInt16(offset, true),
  stageVariant:  dataview.getInt16(offset + 2, true),
  thisXPos:      dataview.getFloat32(offset + 4,  true),
  thisYPos:      dataview.getFloat32(offset + 8,  true),
  thisZPos:      dataview.getFloat32(offset + 12, true),
  transitionBox: [
    dataview.getFloat32(offset + 16, true),
    dataview.getFloat32(offset + 20, true),
    dataview.getFloat32(offset + 24, true),
    dataview.getFloat32(offset + 28, true),
    dataview.getFloat32(offset + 32, true),
  ],
  targetXPos: dataview.getFloat32(offset + 36, true),
  targetYPos: dataview.getFloat32(offset + 40, true),
  targetZPos: dataview.getFloat32(offset + 44, true),
  targetRot0: dataview.getInt16(offset + 48, true),
  targetRot1: dataview.getInt16(offset + 50, true),
});

const ReadAreaMapping = (dataview, offset) => ({
  areaXPos: dataview.getFloat32(offset,      true),
  areaZPos: dataview.getFloat32(offset + 4,  true),
  baseXPos: dataview.getFloat32(offset + 16, true),
  baseZPos: dataview.getFloat32(offset + 20, true),
  knPos:    dataview.getFloat32(offset + 24, true),
});

// ─── Write helpers ────────────────────────────────────────────────────────────
const WriteFloatSet = (dataview, offset, fs) => {
  let dv = immu_write_ushort(dataview, offset,      fs.targetStageId & 0xffff);
  dv = immu_write_ushort(dv, offset + 2,  fs.stageVariant & 0xffff);
  dv = immu_write_float32(dv, offset + 4,  fs.thisXPos);
  dv = immu_write_float32(dv, offset + 8,  fs.thisYPos);
  dv = immu_write_float32(dv, offset + 12, fs.thisZPos);
  fs.transitionBox.forEach((val, i) => {
    dv = immu_write_float32(dv, offset + 16 + i * 4, val);
  });
  dv = immu_write_float32(dv, offset + 36, fs.targetXPos);
  dv = immu_write_float32(dv, offset + 40, fs.targetYPos);
  dv = immu_write_float32(dv, offset + 44, fs.targetZPos);
  dv = immu_write_ushort(dv, offset + 48, fs.targetRot0 & 0xffff);
  dv = immu_write_ushort(dv, offset + 50, fs.targetRot1 & 0xffff);
  return dv;
};

const WriteAreaMapping = (dataview, offset, m) => {
  let dv = immu_write_float32(dataview, offset,      m.areaXPos);
  dv = immu_write_float32(dv, offset + 4,  m.areaZPos);
  dv = immu_write_float32(dv, offset + 16, m.baseXPos);
  dv = immu_write_float32(dv, offset + 20, m.baseZPos);
  dv = immu_write_float32(dv, offset + 24, m.knPos);
  return dv;
};

// ─── Public API ───────────────────────────────────────────────────────────────
export const ReadZoneTransitions = (dataview) => {
  const areaTransitionsPtr = dataview.getUint32(0x1c, true);
  if (areaTransitionsPtr === 0 || areaTransitionsPtr >= dataview.byteLength)
    return { zones: [], mappings: [] };

  const areaCount = dataview.getUint8(AREA1_ZONES_OFFSET);
  if (areaCount === 0 || areaCount > 16)
    return { zones: [], mappings: [] };

  // ── Zone transitions ──
  const zones = [];
  for (let i = 0; i < areaCount; i++) {
    const floatsPtr = dataview.getUint32(areaTransitionsPtr + i * 4, true);
    const transitions = [];

    if (floatsPtr !== 0 && floatsPtr < dataview.byteLength) {
      let offset = floatsPtr;
      while (offset + FLOAT_SET_SIZE <= dataview.byteLength) {
        if (dataview.getInt32(offset, true) === -1) break;
        transitions.push(ReadFloatSet(dataview, offset));
        offset += FLOAT_SET_SIZE;
      }
    }

    zones.push({ zoneIndex: i, floatsPtr, transitions });
  }

  // ── Area mappings ──
  const areaMappingPtr = dataview.getUint32(0x20, true);
  const mappings = [];
  if (
    areaMappingPtr !== 0 &&
    areaMappingPtr < dataview.byteLength &&
    areaMappingPtr < areaTransitionsPtr
  ) {
    const count = Math.floor(
      (areaTransitionsPtr - areaMappingPtr) / AREA_MAPPINGS_SIZE
    );
    for (let i = 0; i < count; i++) {
      const offset = areaMappingPtr + i * AREA_MAPPINGS_SIZE;
      if (offset + AREA_MAPPINGS_SIZE > dataview.byteLength) break;
      mappings.push({ index: i, ...ReadAreaMapping(dataview, offset) });
    }
  }

  return { zones, mappings };
};

export const WriteZoneTransitions = (dataview, { zones, mappings }) => {
  let dv = dataview;

  // ── Write transitions per zone ──
  zones.forEach((zone) => {
    if (zone.floatsPtr === 0) return;

    zone.transitions.forEach((fs, idx) => {
      const offset = zone.floatsPtr + idx * FLOAT_SET_SIZE;
      dv = WriteFloatSet(dv, offset, fs);
    });

    // Sentinel after last entry
    const sentinelOffset = zone.floatsPtr + zone.transitions.length * FLOAT_SET_SIZE;
    if (sentinelOffset + 4 <= dv.byteLength) {
      dv = immu_write_uint32(dv, sentinelOffset, TRANSITION_SENTINEL);
    }
  });

  // ── Write area mappings (fixed count, no sentinel) ──
  const areaMappingPtr = dataview.getUint32(0x20, true);
  if (areaMappingPtr !== 0) {
    mappings.forEach((mapping, idx) => {
      const offset = areaMappingPtr + idx * AREA_MAPPINGS_SIZE;
      if (offset + AREA_MAPPINGS_SIZE <= dv.byteLength) {
        dv = WriteAreaMapping(dv, offset, mapping);
      }
    });
  }

  return dv;
};
