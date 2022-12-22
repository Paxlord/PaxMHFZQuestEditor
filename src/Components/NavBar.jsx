import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuestData } from "../Hooks/useQuestData";
import { QuestToQuestList } from "../Utils/QuestParams/questlist_utils";
import { ReadQuestStrings } from "../Utils/QuestParams/string_utils";
import { save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';

import bigmonster from '../assets/bigmonster.webp';
import smallmonster from '../assets/smallmonster.webp';
import gatherables from '../assets/gatherables.webp';
import misc from '../assets/misc.webp';
import quest from '../assets/quest.webp';
import questrewards from '../assets/questrewards.webp';
import queststrings from '../assets/queststrings.webp';

import questpaper from '../assets/questpaper.png';

const menu = [
  {
    label: "Quest Params",
    to: "/questparams",
    disabled: false,
    icon: quest
  },
  {
    label: "Big Monsters",
    to: "/bigmonsters",
    disabled: false,
    icon: bigmonster
  },
  {
    label: "Small Monsters (TBI)",
    to: "/smallmonsters",
    disabled: true,
    icon: smallmonster
  },
  {
    label: "Gatherables (TBI)",
    to: "/gatherables",
    disabled: true,
    icon: gatherables
  },
  {
    label: "Quest Rewards",
    to: "/questrewards",
    disabled: false,
    icon: questrewards
  },
  {
    label: "Quest Strings",
    to: "/queststrings",
    disabled: false,
    icon: queststrings
  },
  {
    label: "Misc Params",
    to: "/miscparams",
    disabled: false,
    icon: misc
  }
]

const MenuItem = ({menuItem, selected, onClick}) => {

  return(
    <div className={`py-2 px-2 ${selected?"bg-green-600":""} hover:bg-green-600 rounded-md cursor-pointer transition ease-in-out`}>
      <Link disabled={menuItem.disabled || selected} to={menuItem.to} onClick={onClick} className={`w-full  text-zinc-200 text-md  py-2 px-2 `}>{menuItem.label}</Link>
    </div>
  );
}


const NavBar = () => {

  const [selectedIndex, setSelectedIndex ] = useState(-1);
  const { resetData, saveDataToFile, questDataView } = useQuestData();

  const onLinkClick = (index) => {
    setSelectedIndex(index);
  }

  const generateQuestList = async () => {

    let fileName = await save({
      filters: [{
        name: 'Quest Binary',
        extensions: ['bin']
      }]
    });

    console.log("filename ", fileName);
    let questListArray = QuestToQuestList({dataView: questDataView});
    let simpleArray = Array.from(questListArray);

    if(fileName)
      await invoke("save_byte_array_to_file", { path: fileName, bytes: simpleArray})

  }

  return(
    <div className="relative flex flex-col h-full">
      <div className="relative flex justify-center items-center h-16 w-[120%] -translate-x-5 -rotate-3 translate-y-8">
        <p className="text-5xl font-monsterhunter translate-y-2 text-green-700">53187</p>
        <img src={questpaper} className="absolute top-0 left-0 -z-10 w-96 "/>
      </div>
      <nav className="flex mt-10 flex-col gap-y-3 flex-grow font-source justify-center text-base">
        
        {menu.map((menuItem, idx) => {
          const selected = idx === selectedIndex;
          return (
              <div className={`relative flex gap-x-2 ${selected?"bg-green-600":""} hover:bg-green-600 rounded-md cursor-pointer transition ease-out`}>
                <img src={menuItem.icon} className={`transition ease-in-out absolute   ${selected?"h-9 w-9 -translate-y-1 -rotate-12 -translate-x-3":"h-6 w-6 translate-y-2 "}`}/>
                <Link disabled={menuItem.disabled || selected} to={menuItem.to} onClick={() => onLinkClick(idx)} className={`w-full h-full pl-8 py-2 px-2 inline-block text-zinc-200 text-base`}>{menuItem.label}</Link>
              </div>
            )
        })}
      </nav>
        {/* <button onClick={() => resetData()}>Reset Data</button>
        <button onClick={() => saveDataToFile(true) }>Save As...</button>
        <button onClick={() => generateQuestList()}>Generate Quest List...</button> */}
    </div>
  );

}

export default NavBar