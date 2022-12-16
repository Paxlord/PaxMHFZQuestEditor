import Encoding from "encoding-japanese";

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