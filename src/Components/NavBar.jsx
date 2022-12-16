import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuestData } from "../Hooks/useQuestData";
import { QuestToQuestList } from "../Utils/QuestParams/questlist_utils";
import { ReadQuestStrings } from "../Utils/QuestParams/string_utils";
import { save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';

const menu = [
  {
    label: "Quest Params",
    to: "/questparams",
    disabled: false,
  },
  {
    label: "Big Monsters",
    to: "/bigmonsters",
    disabled: false,
  },
  {
    label: "Small Monsters (TBI)",
    to: "/smallmonsters",
    disabled: true,
  },
  {
    label: "Gatherables (TBI)",
    to: "/gatherables",
    disabled: true,
  },
  {
    label: "Quest Rewards",
    to: "/questrewards",
    disabled: false,
  },
  {
    label: "Quest Strings (TBI)",
    to: "/queststrings",
    disabled: true,
  }
]


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
    <nav className="flex flex-col mt-2 flex-grow">
      {menu.map((menuItem, idx) => {

        if(menuItem.disabled)
          return <div className="transition ease-in-out font-medium text-zinc-200 line-through text-md py-4 px-2 rounded-sm cursor-default">{menuItem.label}</div>

        if(idx === selectedIndex)
          return <div className="transition ease-in-out font-medium text-violet-500 text-md py-4 px-2 rounded-sm cursor-default">{menuItem.label}</div>
        
        return <Link to={menuItem.to} onClick={() => onLinkClick(idx)} className="transition ease-in-out text-zinc-200 text-md hover:text-violet-500 py-4 px-2 rounded-sm cursor-pointer">{menuItem.label}</Link>
      })}
      <button onClick={() => resetData()}>Reset Data</button>
      <button onClick={() => saveDataToFile() }>Save As...</button>
      <button onClick={() => generateQuestList()}>Generate Quest List...</button>
    </nav>
  );

}

export default NavBar