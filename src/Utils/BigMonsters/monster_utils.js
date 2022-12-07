const ReadMonsterStat = (dataview, offset) => {

  let posOffset = offset + 32;

  return{
    emid: dataview.getUint32(offset, true),
    qty: dataview.getUint32(offset + 4, true),
    zoneId: dataview.getUint32(offset + 8, true),
    position: {
      x: dataview.getFloat32(posOffset, true),
      y: dataview.getFloat32(posOffset + 4, true),
      z: dataview.getFloat32(posOffset + 8, true),
    }
  }

}

export const ReadMonsterArray = (dataview) => {

  let monsterStructSize = 0x3c
  let monsterSectOffset = 0x18
  let monsterSectAddr = dataview.getUint32(monsterSectOffset, true);
  let monsterDetailsAddr = dataview.getUint32(monsterSectAddr + 12, true);


  let monsterArray = [];

  for(let i = 0; i < 5; i++){
    let emid = dataview.getUint32(monsterDetailsAddr + (i*monsterStructSize), true);
    console.log(emid);

    if(emid === 0xffff){
      monsterArray.push(null);
      continue;
    }

    monsterArray.push(
      ReadMonsterStat(dataview, monsterDetailsAddr + (i*monsterStructSize))
    );
  }

  return monsterArray;
}