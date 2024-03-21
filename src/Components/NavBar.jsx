import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useQuestData } from "../Hooks/useQuestData";
import { QuestToQuestList } from "../Utils/QuestParams/questlist_utils";
import { ReadQuestStrings } from "../Utils/QuestParams/string_utils";
import { save } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

import bigmonster from "../assets/bigmonster.webp";
import smallmonster from "../assets/smallmonster.webp";
import gatherables from "../assets/gatherables.webp";
import misc from "../assets/misc.webp";
import quest from "../assets/quest.webp";
import questrewards from "../assets/questrewards.webp";
import queststrings from "../assets/queststrings.webp";
import equipment from "../assets/equipment.webp";

import item_manager from "../assets/item_manager.webp";
import weapon_manager from "../assets/weapon_manager.webp";
import armor_manager from "../assets/armor_manager.webp";

import { toast } from "react-toastify";
import { WebviewWindow } from "@tauri-apps/api/window";
import NavMenu from "./NavMenu";

const menu = [
  {
    label: "Quest Params",
    to: "/questparams",
    disabled: false,
    icon: quest,
  },
  {
    label: "Big Monsters",
    to: "/bigmonsters",
    disabled: false,
    icon: bigmonster,
  },
  {
    label: "Small Monsters (TBI)",
    to: "/smallmonsters",
    disabled: true,
    icon: smallmonster,
  },
  {
    label: "Gatherables (TBI)",
    to: "/gatherables",
    disabled: true,
    icon: gatherables,
  },
  {
    label: "Quest Rewards",
    to: "/questrewards",
    disabled: false,
    icon: questrewards,
  },
  {
    label: "Quest Strings",
    to: "/queststrings",
    disabled: false,
    icon: queststrings,
  },
  {
    label: "Equipments",
    to: "/equipments",
    disabled: false,
    icon: equipment,
  },
  {
    label: "Misc Params",
    to: "/miscparams",
    disabled: false,
    icon: misc,
  },
];

const MenuItem = ({ menuItem, selected, onClick }) => {
  return (
    <div
      className={`py-2 px-2 ${
        selected ? "bg-green-600" : ""
      } hover:bg-green-600 rounded-md cursor-pointer transition ease-in-out`}
    >
      <Link
        disabled={menuItem.disabled || selected}
        to={menuItem.to}
        onClick={onClick}
        className={`w-full  text-zinc-200 text-md  py-2 px-2 `}
      >
        {menuItem.label}
      </Link>
    </div>
  );
};

const NavBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  let navigate = useNavigate();
  const { resetData, saveDataToFile, questDataView, originalQuestId } =
    useQuestData();

  const onLinkClick = (index) => {
    setSelectedIndex(index);
  };

  const generateQuestList = async () => {
    let fileName = await save({
      filters: [
        {
          name: "Quest Binary",
          extensions: ["bin"],
        },
      ],
    });

    console.log("filename ", fileName);
    let questListArray = QuestToQuestList({ dataView: questDataView });
    let simpleArray = Array.from(questListArray);

    if (fileName)
      await invoke("save_byte_array_to_file", {
        path: fileName,
        bytes: simpleArray,
      });
  };

  const handleClose = () => {
    navigate("/");
    resetData();
  };

  return (
    <div className="relative flex gap-y-4 flex-col h-full">
      <div className="relative flex justify-center items-center h-16 w-[120%] -translate-x-5 translate-y-0 bg-green-600 rounded shadow-md">
        <h1 className="text-white text-center ">
          Currently Opened Quest
          <br /> <span className="font-bold"> {originalQuestId} </span>
        </h1>
      </div>
      <div className="flex justify-center items-center gap-x-2">
        <button
          onClick={() =>
            new WebviewWindow("item", {
              fullscreen: false,
              height: 720,
              resizable: false,
              title: "Mhfz-Quest-Editor",
              width: 360,
              decorations: false,
              url: "item/index.html",
            })
          }
          className="bg-gray-400/35  hover:bg-green-600 p-2 rounded-full shadow-xl"
        >
          <img src={item_manager} className="h-5 w-5" />
        </button>
        <button disabled className="bg-gray-400/35 p-2 rounded-full shadow-xl">
          <img src={weapon_manager} className="h-5 w-5" />
        </button>
        <button disabled className="bg-gray-400/35 p-2 rounded-full shadow-xl">
          <img src={armor_manager} className="h-5 w-5" />
        </button>
      </div>
      {/* <nav className="flex flex-col gap-y-3 flex-grow font-source text-base">
        {menu
          .filter((menuItem) => !menuItem.disabled)
          .map((menuItem, idx) => {
            const selected = idx === selectedIndex;
            return (
              <div
                className={`relative flex gap-x-2 ${
                  selected ? "bg-green-600" : ""
                } hover:bg-green-600 rounded-md cursor-pointer transition ease-out`}
              >
                <img
                  src={menuItem.icon}
                  className={`transition ease-in-out absolute   ${
                    selected
                      ? "h-9 w-9 -translate-y-1 -rotate-12 -translate-x-3"
                      : "h-6 w-6 translate-y-2 "
                  }`}
                />
                <Link
                  disabled={menuItem.disabled || selected}
                  to={menuItem.to}
                  onClick={() => onLinkClick(idx)}
                  className={`w-full h-full pl-8 py-2 px-2 inline-block text-zinc-200 text-base`}
                >
                  {menuItem.label}
                </Link>
              </div>
            );
          })}
      </nav> */}

      <NavMenu />
      <div className="gap-y-2 flex flex-col">
        <div className="flex gap-x-3 h-8">
          <button
            onClick={() =>
              toast.promise(saveDataToFile(false), {
                pending: "Writing files...",
                success: "Quest written successfully",
                error: "Error while writing files",
              })
            }
            className="transition flex px-1 justify-center items-center gap-x-2 flex-1 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700"
          >
            Save Single
          </button>
          <button
            onClick={() =>
              toast.promise(saveDataToFile(true), {
                pending: "Writing files...",
                success: "Quest written successfully",
                error: "Error while writing files",
              })
            }
            className="transition flex px-1 justify-center items-center gap-x-2 flex-1 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700"
          >
            Save Multi.
          </button>
        </div>
        <button
          onClick={handleClose}
          className="transition px-4 py-1 hover:shadow-md bg-zinc-500 shadow-sm rounded text-white hover:bg-red-500 active:bg-emerald-600"
        >
          Close this quest
        </button>
        {/* <button onClick={() => generateQuestList()}>Generate Quest List...</button> */}
      </div>
    </div>
  );
};

export default NavBar;
