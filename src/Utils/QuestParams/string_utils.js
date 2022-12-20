import Encoding from "encoding-japanese";
import { immu_write_ubyte, immu_write_uint32 } from "../immutable_dataview";
import { AppendZeros, BlankData } from "./misc_utils";

const ReadString = (dataview, offset, nextOffset) => {
  let stringByteList = [];
  
  for(let i = offset; i < nextOffset; i++){
    stringByteList.push(dataview.getUint8(i));
  }

  if(stringByteList.length === 0){
    return {
      string: "",
      sjisArray: [],
      unicodeArray: []
    }
  }

  let isSJIS = Encoding.detect(stringByteList, "SJIS");

  if(isSJIS){
    let utfString = Encoding.convert(stringByteList, {
      to: "UNICODE",
      from: "SJIS"
    });
    return {
      string: String.fromCharCode.apply(null, utfString),
      sjisArray: stringByteList,
      unicodeArray: utfString
    }
  }
  
}

const ReadLastString = (dataview, offset) => {
  let stringByteList = [];

  let curOffset = offset;
  let curChar = dataview.getUint8(curOffset);
 
  while(curChar != 0){
    stringByteList.push(curChar);
    curOffset ++;
    curChar = dataview.getUint8(curOffset);
  }

  if(stringByteList.length === 0){
    return {
      string: "",
      sjisArray: [],
      unicodeArray: []
    }
  }

  let isSJIS = Encoding.detect(stringByteList, "SJIS");

  if(isSJIS){
    let utfString = Encoding.convert(stringByteList, {
      to: "UNICODE",
      from: "SJIS"
    });
    return {
      string: String.fromCharCode.apply(null, utfString),
      sjisArray: stringByteList,
      unicodeArray: utfString
    }
  }
}

export const ReadQuestStrings = (dataview) => {

  let stringAddress = dataview.getUint32(0xe8, true);
  let stringArraySize = 8;
  let stringArray = [];

  for(let i = 0; i < 8; i++){
    console.log("String number ", i);
    if(i === 7){
      stringArray.push(ReadLastString(dataview, dataview.getUint32(stringAddress + (i * 4), true)));
      continue
    }

    let startOffset = dataview.getUint32(stringAddress + (i * 4), true);
    let endOffset = dataview.getUint32(stringAddress + ((i+1) * 4), true);
    stringArray.push(ReadString(dataview, startOffset, endOffset));
  }

  return stringArray;

}

export const WriteStrings = (dataview, strings) => {

  let dv = dataview;
  let stringsAddr = dataview.getUint32(0xe8, true);

  //Before Removing, Store the additional Strings; 
  let addStrings = dataview.getUint32(0x30, true);
  
  let addStringsStartAddr = dataview.getUint32(addStrings, true);
  let addStringsEndAddr = dataview.getUint32(addStrings + 4, true);

  let flavourString = ReadString(dataview, addStringsStartAddr, addStringsEndAddr);
  console.log(flavourString);

  //Check If Space is available 
  if(stringsAddr + 1024 >= dv.byteLength){
    dv = AppendZeros(dv, 2048);
  }


  //Remove the previous Stirngs
  let prevStrings = ReadQuestStrings(dataview);
  let stringSectionLen = prevStrings.reduce((acc, currentVal) => {
    return acc + currentVal.sjisArray.length
  }, 0);

  dv = BlankData(dv, stringsAddr, stringsAddr + stringSectionLen);

  
  //Convert All the new strings to SJIS
  let stringsSjis = [];

  for(let i =0; i<strings.length; i++){
    const {string } = strings[i];
    const sjisArray = Encoding.convert(Encoding.stringToCode(string), "SJIS", "UNICODE");
    stringsSjis.push(sjisArray);
  }

  let curStringAddr = stringsAddr + 32 + flavourString.sjisArray.length;
  let newStringHeader = []

  //Compute Strings Header
  for(let i = 0; i < stringsSjis.length; i++){
    dv = immu_write_uint32(dv, stringsAddr + (i*4), curStringAddr);
    newStringHeader.push(curStringAddr);
    curStringAddr += stringsSjis[i].length;
  }

  //Write Flavour String back
  for(let i = 0; i < flavourString.sjisArray.length; i++){
    dv = immu_write_ubyte(dv, addStringsStartAddr + i, flavourString.sjisArray[i])
  }

  //Write True String
  for(let i = 0; i < newStringHeader.length; i++){
    for(let j = 0; j < stringsSjis[i].length; j++){
      dv = immu_write_ubyte(dv, newStringHeader[i] + j, stringsSjis[i][j]);
    }
  }

  return dv;


}