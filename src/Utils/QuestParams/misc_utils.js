import {
  immu_concat_dataview,
  immu_write_ubyte,
  immu_write_uint32,
  immu_write_ushort,
} from "../immutable_dataview";

export const ReadTimeLimit = (dataview) => {
  return dataview.getUint32(0xe0, true);
};

export const ReadQuestLocale = (dataview) => {
  return dataview.getUint32(0xe4, true);
};

export const ReadQuestFileId = (dataview) => {
  return dataview.getUint16(0xee, true);
};

export const ReadQuestRestrictions = (dataview) => {
  return dataview.getUint16(0xec, true);
};

export const ReadRankRestrictions = (dataview) => {
  return {
    postRank: {
      min: dataview.getUint16(0x10a, true),
      max: dataview.getUint16(0x10c, true),
    },
    joinRank: {
      min: dataview.getUint16(0x10e, true),
      max: dataview.getUint16(0x110, true),
    },
  };
};

export const ReadStars = (dataview) => {
  return dataview.getUint8(0xc4);
};

export const ReadMandatoryFlag = (dataview) => {
  return dataview.getUint8(0x108);
};

export const ReadRewardMats = (dataview) => {
  return {
    reward1: dataview.getUint16(0x170, true),
    reward2: dataview.getUint16(0x172, true),
    reward3: dataview.getUint16(0x174, true),
  };
};

export const AppendZeros = (dataview, bytes) => {
  let zeroArray = [];

  for (let i = 0; i < bytes; i++) {
    zeroArray.push(0);
  }

  let zeroU8 = new Uint8Array(zeroArray);
  return immu_concat_dataview(dataview, zeroU8);
};

export const BlankData = (dataview, startOffset, endOffset) => {
  let dv = dataview;

  for (let i = startOffset; i < endOffset; i++) {
    dv = immu_write_ubyte(dv, i, 0);
  }

  return dv;
};

export const WriteTimeLimit = (dataview, timeLimit) => {
  return immu_write_uint32(dataview, 0xe0, timeLimit);
};

export const WriteQuestFileId = (dataview, questFileId) => {
  return immu_write_ushort(dataview, 0xee, questFileId);
};

export const WriteRankRestriction = (dataview, ranks) => {
  let dv = dataview;
  const { postRank, joinRank } = ranks;
  dv = immu_write_ushort(dv, 0x10a, postRank.min);
  dv = immu_write_ushort(dv, 0x10c, postRank.max);
  dv = immu_write_ushort(dv, 0x10e, joinRank.min);
  dv = immu_write_ushort(dv, 0x110, joinRank.max);
  return dv;
};

export const WriteRewardMats = (dataview, rewardsMats) => {
  let dv = dataview;
  dv = immu_write_ushort(dv, 0x170, rewardsMats.reward1);
  dv = immu_write_ushort(dv, 0x172, rewardsMats.reward2);
  dv = immu_write_ushort(dv, 0x174, rewardsMats.reward3);
  return dv;
};

export const WriteStars = (dataview, stars) => {
  return immu_write_ubyte(dataview, 0xc4, stars);
};

export const WriteMandatoryFlag = (dataview, flag) => {
  return immu_write_ubyte(dataview, 0x108, flag);
};

export const WriteQuestRequirements = (dataview, requirement) => {
  return immu_write_ushort(dataview, 0xec, requirement);
};
