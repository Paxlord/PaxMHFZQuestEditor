export const ReadMonsterParams = (dataview) => {

  const baseOffset = 0x44;

  return {
    size: dataview.getUint16(baseOffset, true),
    wdth: dataview.getUint16(baseOffset+2, true),
    difficulty: dataview.getUint16(baseOffset+4, true),
    hardcoreA: dataview.getUint8(baseOffset+6, true),
    hardcoreB: dataview.getUint8(baseOffset+7, true),
  }

} 