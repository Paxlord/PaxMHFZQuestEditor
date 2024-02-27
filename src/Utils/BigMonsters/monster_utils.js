import { immu_write_float32, immu_write_uint32 } from "../immutable_dataview";

const EmptyMonster = {
  emid: 65535,
  qty: 0,
  zoneId: 0,
  locationId: 0,
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
};

const ReadMonsterStat = (dataview, offset) => {
  let posOffset = offset + 32;

  return {
    emid: dataview.getUint32(offset, true),
    qty: dataview.getUint32(offset + 4, true),
    zoneId: dataview.getUint32(offset + 8, true),
    locationId: dataview.getUint32(offset + 28, true),
    position: {
      x: dataview.getFloat32(posOffset, true),
      y: dataview.getFloat32(posOffset + 4, true),
      z: dataview.getFloat32(posOffset + 8, true),
    },
  };
};

const WriteMonster = (dataview, offset, offsetHeader, monster) => {
  //Write Monster header
  let newDV = immu_write_uint32(
    dataview,
    offsetHeader,
    monster.emid === 65535 ? 0 : monster.emid
  );

  let currOffset = 0;
  //Write monster Infos
  newDV = immu_write_uint32(newDV, offset + currOffset, monster.emid);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, monster.qty);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, monster.zoneId);
  currOffset += 4;

  //4 INT SKIP
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;

  //UNK ID MAYBE 0 IS FINE
  newDV = immu_write_uint32(newDV, offset + currOffset, monster.locationId);
  currOffset += 4;

  //POS
  newDV = immu_write_float32(newDV, offset + currOffset, monster.position.x);
  currOffset += 4;
  newDV = immu_write_float32(newDV, offset + currOffset, monster.position.y);
  currOffset += 4;
  newDV = immu_write_float32(newDV, offset + currOffset, monster.position.z);
  currOffset += 4;

  //4 INT SKIP EOF
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);
  currOffset += 4;
  newDV = immu_write_uint32(newDV, offset + currOffset, 0);

  return newDV;
};

export const WriteMonsters = (dataview, monsters) => {
  let monsterHeaderAddr = dataview.getUint32(0x18, true);
  let monsterStructSize = 0x3c;

  let monsterListOffset = dataview.getUint32(monsterHeaderAddr + 8, true);
  let monsterDetailsOffset = dataview.getUint32(monsterHeaderAddr + 12, true);

  let dv = dataview;

  for (let i = 0; i < monsters.length; i++) {
    let curMonsterDetailsOff = monsterDetailsOffset + i * monsterStructSize;
    let curMonsterListOff = monsterListOffset + i * 4;

    if (monsters[i] == null) {
      dv = WriteMonster(
        dv,
        curMonsterDetailsOff,
        curMonsterListOff,
        EmptyMonster
      );
      continue;
    }

    dv = WriteMonster(dv, curMonsterDetailsOff, curMonsterListOff, monsters[i]);
  }

  return dv;
};

export const ReadMonsterArray = (dataview) => {
  let monsterStructSize = 0x3c;
  let monsterSectOffset = 0x18;
  let monsterSectAddr = dataview.getUint32(monsterSectOffset, true);
  let monsterDetailsAddr = dataview.getUint32(monsterSectAddr + 12, true);

  let monsterArray = [];

  for (let i = 0; i < 5; i++) {
    let emid = dataview.getUint32(
      monsterDetailsAddr + i * monsterStructSize,
      true
    );
    console.log(emid);

    if (emid === 0xffff) {
      monsterArray.push(null);
      continue;
    }

    monsterArray.push(
      ReadMonsterStat(dataview, monsterDetailsAddr + i * monsterStructSize)
    );
  }

  return monsterArray;
};
