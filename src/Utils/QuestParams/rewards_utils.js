const ReadReward = (dataview, offset) => {
  return {
    percent_chance: dataview.getUint16(offset, true),
    item_id: dataview.getUint16(offset+2, true),
    item_count: dataview.getUint16(offset+4, true)
  }
}

const ReadBox = (dataview, boxAddr, maxAmount) => {

  let intValue = 0;
  let stopper = (maxAmount*6)

  let boxItems = [];

  for(let i = 0; i < (maxAmount*6); i++){
    intValue = dataview.getUint16(boxAddr + i, true);

    if(intValue === 0xffff){
      stopper = i;
      break;
    }

  }

  for(let i = 0; i < stopper; i+=6){
    boxItems.push(ReadReward(dataview, boxAddr + i))
  }

  return boxItems;

}

const RewardSweep = (dataview, offset) => {
  let rewardAddresses = [];
  let stopper = 0;
  let intValue = 0;

  for(let i = 0; i < 8 * 8; i++){
    intValue = dataview.getUint32(offset + i, true);

    if(intValue === 0xffff){
      stopper = i;
      break;
    }

  }

  if(stopper === 0){
    console.error("Didn't find any EoF in header reward")
    return rewardAddresses;
  }

  for(let i = 0; i < stopper; i+=8){
    rewardAddresses.push({
      rewardBoxId: dataview.getUint8((offset + i)),
      rewardBoxUnk: dataview.getUint16((offset + i + 1), true),
      rewardBoxUnk2: dataview.getUint8(0, true),
      rewardBoxAddr: dataview.getUint32((offset + i + 4), true),
      rewardMaxSlot: IdToMaxSlots(dataview.getUint8((offset + i))),
    });
  }

  return rewardAddresses;

}

const IdToMaxSlots = (id) => {
  switch(id){
    case 0:
      return 24;
    case 1:
      return 24;
    case 2:
      return 4;
    case 3:
      return 4;
    default:
      return 8;
  }
}

export const ReadAllRewards = (dataview) => {

  let rewardHeaderAddress = dataview.getUint32(0xc, true);
  let rewardBoxesInfo = RewardSweep(dataview, rewardHeaderAddress);
  let rewardBoxes = [];

  rewardBoxesInfo.forEach((rewardBox) => {
    let rewardList = ReadBox(dataview, rewardBox.rewardBoxAddr, rewardBox.rewardMaxSlot);
    rewardBoxes.push({
      rewardHeader: {...rewardBox},
      rewards: [...rewardList]
    });
  });

  return rewardBoxes;

}