import { immu_write_ubyte, immu_write_uint32, immu_write_ushort } from "../immutable_dataview";
import { AppendZeros, BlankData } from "./misc_utils";

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
      rewardBoxUnk2: 0,
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

export const WriteRewards = (dataview, rewards) => {

  let stringsSectionPointer = dataview.getUint32(0xe8, true);
  let questRewardsPointer = dataview.getUint32(0xc, true);
  
  let newBoxSectionSize = 160;
  let appendingByteSize = 2048;
  let offsetFromStringPointer = 1024;

  let dv = dataview;

  let newQuestRewardsAddr = stringsSectionPointer + offsetFromStringPointer;

  //Reward above Strings so we append some zeros at the end
  if(questRewardsPointer < stringsSectionPointer && newQuestRewardsAddr >= dv.byteLength) {
    dv = AppendZeros(dv, appendingByteSize);
  }else{
    //Blanking everything so we don't have residual id that don't make the file readable
    dv = BlankData(dv, newQuestRewardsAddr, dv.byteLength); 
  }

  
  for(let i = 0; i < rewards.length + 1; i++){

    //FF00 End of header section
    if(i === rewards.length){ 
      const currentItemOffSet = newQuestRewardsAddr + (i * 8);
      dv = immu_write_ubyte(dv, currentItemOffSet, 0xff);
      dv = immu_write_ubyte(dv, currentItemOffSet + 1, 0xff);
      dv = immu_write_ushort(dv, currentItemOffSet + 3, 0);
      dv = immu_write_uint32(dv, currentItemOffSet + 4, 0);
      continue;
    }

    //Write header
    const {rewardHeader} = rewards[i];
    const currentItemOffSet = newQuestRewardsAddr + (i * 8);

    dv = immu_write_ubyte(dv, currentItemOffSet, rewardHeader.rewardBoxId);
    dv = immu_write_ubyte(dv, currentItemOffSet + 1, rewardHeader.rewardBoxUnk);
    dv = immu_write_ushort(dv, currentItemOffSet + 3, rewardHeader.rewardBoxUnk2);

    const currentBoxAddr =newQuestRewardsAddr + ((rewards.length + 1) * 8) + (i * newBoxSectionSize)
    dv = immu_write_uint32(dv, currentItemOffSet + 4, currentBoxAddr);

  }

  //Write Items
  for(let i = 0; i < rewards.length; i++) {
    const {rewards: itemRewards} = rewards[i];
    let currentBoxStartAddr = newQuestRewardsAddr + ((rewards.length + 1) * 8) + (i * newBoxSectionSize);
    let currentItemCounter = currentBoxStartAddr;

    for(let j = 0; j < itemRewards.length; j++){
      const {percent_chance, item_id, item_count} = itemRewards[j];
      dv = immu_write_ushort(dv, currentItemCounter, percent_chance);
      currentItemCounter += 2;
      dv = immu_write_ushort(dv, currentItemCounter, item_id);
      currentItemCounter += 2;
      dv = immu_write_ushort(dv, currentItemCounter , item_count);
      currentItemCounter += 2;

    }

    //Write a 0xFF to end item box
    dv = immu_write_ushort(dv, currentItemCounter, 0xFFFF);
    currentItemCounter += 2;
  }

  //Updating File Header POinter
  dv = immu_write_uint32(dv, 0xc, newQuestRewardsAddr);

  return dv;

}
