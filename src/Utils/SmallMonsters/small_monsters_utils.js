import {
  immu_write_float32,
  immu_write_ubyte,
  immu_write_uint32,
  immu_write_ushort,
} from "../immutable_dataview";

const MINION_SPAWN_SIZE = 60;
const MINION_SENTINEL = 0xffff;

const ReadMinionSpawn = (dataview, offset) => {
  return {
    monsterId: dataview.getUint8(offset),
    spawnToggle: dataview.getUint16(offset + 2, true),
    spawnAmount: dataview.getUint32(offset + 4, true),
    unk0: dataview.getUint32(offset + 8, true),
    unk1: dataview.getUint32(offset + 28, true),
    position: {
      x: dataview.getFloat32(offset + 32, true),
      y: dataview.getFloat32(offset + 36, true),
      z: dataview.getFloat32(offset + 40, true),
    },
  };
};

const WriteMinionSpawn = (dataview, offset, spawn) => {
  let dv = immu_write_ubyte(dataview, offset, spawn.monsterId);
  dv = immu_write_ushort(dv, offset + 2, spawn.spawnToggle);
  dv = immu_write_uint32(dv, offset + 4, spawn.spawnAmount);
  dv = immu_write_uint32(dv, offset + 8, spawn.unk0);
  dv = immu_write_uint32(dv, offset + 28, spawn.unk1);
  dv = immu_write_float32(dv, offset + 32, spawn.position.x);
  dv = immu_write_float32(dv, offset + 36, spawn.position.y);
  dv = immu_write_float32(dv, offset + 40, spawn.position.z);
  return dv;
};

const ReadMinionSpawnList = (dataview, pointer) => {
  let spawns = [];
  let offset = pointer;

  while (true) {
    if (offset + MINION_SPAWN_SIZE > dataview.byteLength) break;
    if (dataview.getUint16(offset, true) === MINION_SENTINEL) break;
    spawns.push({ ...ReadMinionSpawn(dataview, offset), fileOffset: offset });
    offset += MINION_SPAWN_SIZE;
  }

  return spawns;
};

const ReadMapSections = (dataview, areaPointer) => {
  let sections = [];
  let offset = areaPointer;

  while (true) {
    if (offset + 16 > dataview.byteLength) break;
    let loadedStage = dataview.getUint32(offset, true);
    if (loadedStage === 0) break;

    let smallMonsterPointer = dataview.getUint32(offset + 12, true);

    sections.push({
      loadedStage,
      unk0: dataview.getUint32(offset + 4, true),
      monsterPointer: dataview.getUint32(offset + 8, true),
      smallMonsterPointer,
      smallMonsters:
        smallMonsterPointer !== 0
          ? ReadMinionSpawnList(dataview, smallMonsterPointer)
          : [],
    });

    offset += 16;
  }

  return sections;
};

export const ReadAllSmallMonsters = (dataview) => {
  let questMapAreaAddr = dataview.getUint32(0x14, true);
  if (questMapAreaAddr === 0 || questMapAreaAddr >= dataview.byteLength)
    return [];

  let mapGroups = [];

  for (let i = 0; i < 3; i++) {
    let areaPtr = dataview.getUint32(questMapAreaAddr + i * 4, true);
    if (areaPtr === 0 || areaPtr >= dataview.byteLength) break;

    let sections = ReadMapSections(dataview, areaPtr);
    if (sections.length > 0) {
      mapGroups.push({ groupIndex: i, sections });
    }
  }

  return mapGroups;
};

export const WriteAllSmallMonsters = (dataview, mapGroups) => {
  let dv = dataview;

  mapGroups.forEach((group) => {
    group.sections.forEach((section) => {
      if (section.smallMonsterPointer === 0) return;

      // Write spawns sequentially from the section's base pointer
      section.smallMonsters.forEach((spawn, idx) => {
        const offset = section.smallMonsterPointer + idx * MINION_SPAWN_SIZE;
        dv = WriteMinionSpawn(dv, offset, spawn);
      });

      // Write sentinel after the last active spawn
      const sentinelOffset =
        section.smallMonsterPointer +
        section.smallMonsters.length * MINION_SPAWN_SIZE;
      if (sentinelOffset + 2 <= dv.byteLength) {
        dv = immu_write_ushort(dv, sentinelOffset, MINION_SENTINEL);
      }
    });
  });

  return dv;
};
