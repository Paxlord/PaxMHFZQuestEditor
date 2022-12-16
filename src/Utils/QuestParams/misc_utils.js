export const ReadTimeLimit = (dataview) => {
  return dataview.getUint32(0xe0, true);
}

export const ReadQuestLocale = (dataview) =>{
  return dataview.getUint32(0xe4, true);
}

export const ReadQuestFileId = (dataview) => {
  return dataview.getUint16(0xee, true);
}

export const ReadQuestRestrictions = (dataview) => {
  return dataview.getUint16(0xec, true); 
}

export const ReadRankRestrictions = (dataview) => {
  return {
    postRank:{
      min: dataview.getUint16(0x10a, true),
      max: dataview.getUint16(0x10c, true),
    },
    joinRank:{
      min: dataview.getUint16(0x10e, true),
      max: dataview.getUint16(0x110, true),
    }
  }
}

export const ReadRewardMats = (dataview) => {
  return {
    reward1: dataview.getUint16(0x170, true),
    reward2: dataview.getUint16(0x172, true),
    reward3: dataview.getUint16(0x174, true),
  }
}