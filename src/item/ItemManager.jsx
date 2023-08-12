import NoButtonPanel from "../Components/NoButtonPanel"
import { useState } from "react";
import { BasicButton, PanelTitle } from "../Components/StyledComponents"
import { ItemsOptions } from "../Data/items"
import { NumeralInput, TextInput } from '../Components/Form/InputComponent';

const ListItem = ({itemName, itemId}) => {
  return(
    <div className="h-12 bg-zinc-500 bg-opacity-60 backdrop-blur-sm rounded py-2 px-2 shadow-lg flex justify-between items-center">
        <p className="text-green-500 font-medium">{itemId}</p>
        <p className="text-white">{itemName}</p>
        <button className="transition px-4 py-1 hover:shadow-md bg-zinc-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700">Copy</button>
    </div>
  )
}

const DecToBeShort = (nb) => {
  let beStr = nb.toString(16).toUpperCase();
  let zeros = "";
  for(let i = beStr.length; i < 4; i++){
    zeros+='0';
  }
  return zeros + beStr;
}

const DecToLEShort = (nb) => {
  let beStr = DecToBeShort(nb);

  console.log(beStr);

  let firstByte = beStr.substring(0,2);
  let secondByte = beStr.substring(2);

  console.log(firstByte);
  console.log(secondByte);

  return secondByte + firstByte;
}

const LE16ToBE16 = (str) => {

  let leshort = str;
  if(leshort.length%2 !== 0)
    leshort = '0' + leshort;

  let zeros = '';
  for(let i = leshort.length; i < 4; i++){
    zeros+='0';
  }

  leshort = leshort + zeros;
  console.log(leshort);
  let firstByte = leshort.substring(0,2);
  let secondByte = leshort.substring(2);
  return secondByte + firstByte;
}

const BEShortToDec = (str) => {
  return parseInt(str, 16);
}

const LEShortToDec = (str) => {
  let beshort = LE16ToBE16(str);
  return BEShortToDec(beshort);
}

export const ItemManager = () => {

  const [filteredItems, setFilteredItems] = useState(ItemsOptions);
  const [itemSize, setItemSize] = useState(ItemsOptions.length);
  
  const [nameSearchQuery, setNameSearchQuery] = useState(null);
  const [itemdecId, setItemdecId] = useState(null);
  const [itemLEId, setItemLEId] = useState(null);
  const [itemBEId, setItemBEId] = useState(null);

  const [sliceStart, setSliceStart] = useState(0);
  const [itemLimit, setItemLimit] = useState(50);

  const FilterByName = (q) => {
    console.log("trigger");
    setNameSearchQuery(q);

    setSliceStart(0);

    setItemBEId("");
    setItemLEId("");
    setItemdecId("");

    if(!q){
      setFilteredItems(ItemsOptions);
      setItemSize(ItemsOptions.length);
      return
    }

    let array = ItemsOptions.filter((item) => item.label.toLowerCase().includes(q.toLowerCase()))

    setFilteredItems(array);
    setItemSize(array.length);
  }

  const FilterByIdDec = (q) => {
    setItemdecId(q);
    
    if(!q){
      setFilteredItems(ItemsOptions);
      setItemSize(ItemsOptions.length);
      setItemBEId("");
      setItemLEId("");
      return
    }

    let nb = parseInt(q);
    if (!nb)
      return

    setNameSearchQuery("");

    setItemBEId(DecToBeShort(nb));
    setItemLEId(DecToLEShort(nb));

    let array = ItemsOptions.filter((item) => item.value === nb);
    setFilteredItems(array);
    setItemSize(array.length);
  }

  const FilterByIdBE = (q) => {
    setItemBEId(q)

    if(!q){
      setFilteredItems(ItemsOptions);
      setItemSize(ItemsOptions.length);
      setItemLEId("");
      setItemdecId("");
      return
    }

    let nb = BEShortToDec(q);

    if(!nb)
      return

    setNameSearchQuery("");
    setItemdecId(nb);
    setItemLEId(DecToLEShort(nb));

    let array = ItemsOptions.filter((item) => item.value === nb);
    setFilteredItems(array);
    setItemSize(array.length);
  }

  const FilterByIdLE = (q) => {
    setItemLEId(q);

    if(!q){
      setFilteredItems(ItemsOptions);
      setItemSize(ItemsOptions.length);
      setItemBEId("");
      setItemdecId("");
      return
    }

    let nb = LEShortToDec(q);

    if(!nb)
      return

    setNameSearchQuery("");
    setItemdecId(nb);
    setItemBEId(DecToBeShort(nb));

    let array = ItemsOptions.filter((item) => item.value === nb);
    setFilteredItems(array);
    setItemSize(array.length);
  }

  const toPrevPage = () => {
    if( sliceStart - itemLimit < 0){
      setSliceStart(0);
      return;
    }

    setSliceStart(sliceStart - itemLimit);
  }

  const toNextPage = () => {
    if(sliceStart + itemLimit >= itemSize){
      return
    }

    setSliceStart(sliceStart + itemLimit);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-30px)] mt-titlebar p-4 gap-y-4">
      <div>
        <NoButtonPanel>
          <div className="mb-5">
            <TextInput size="full" label="Name Search" defaultValue={nameSearchQuery} onChange={(value) => FilterByName(value)}/>
          </div>
          <div className="flex flex-row gap-x-3">
            <NumeralInput size="full" label={"ID (dec)"} defaultValue={itemdecId} onChange={(value) => FilterByIdDec(value)}/>
            <TextInput size="full" label={"ID (hex LE)"} defaultValue={itemLEId} onChange={(value) => FilterByIdLE(value)}/>
            <TextInput size="full" label={"ID (hex BE)"} defaultValue={itemBEId} onChange={(value) => FilterByIdBE(value)}/>
          </div>
        </NoButtonPanel>
      </div>
      <div className="h-6 flex flex-row justify-between">
          <p className="italic text-green-500">{sliceStart} - {(sliceStart + itemLimit<=filteredItems.length)?(sliceStart + itemLimit -1):filteredItems.length} of {itemSize} results</p>
          <div className="flex flex-row gap-x-2 mr-3">
            <button onClick={() => toPrevPage()} className="text-white hover:bg-green-500 transition px-2 rounded cursor-pointer">{"prev."}</button>
            <button onClick={() => toNextPage()}  className="text-white hover:bg-green-500 transition px-2 rounded cursor-pointer">{"next"}</button>
          </div>
      </div>
      <div className="flex-grow overflow-auto flex flex-col gap-y-2">
        {filteredItems && filteredItems.slice(sliceStart, (sliceStart + itemLimit<=filteredItems.length)?(sliceStart + itemLimit):undefined).map((item) => {
          return(
            <ListItem itemName={item.label} itemId={item.value} />
          )
        })}
      </div>
    </div>
  )

}