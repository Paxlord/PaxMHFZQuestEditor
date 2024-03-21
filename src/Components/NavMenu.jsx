import { useState } from "react";

import bigmonster from "../assets/bigmonster.webp";
import smallmonster from "../assets/smallmonster.webp";
import gatherables from "../assets/gatherables.webp";
import misc from "../assets/misc.webp";
import quest from "../assets/quest.webp";
import questrewards from "../assets/questrewards.webp";
import queststrings from "../assets/queststrings.webp";
import equipment from "../assets/equipment.webp";

const categories = ["Quest", "Monsters", "Equipment", "Map"];
const subLinks = [
  ["Params", "Rewards", "String", "Misc", "Supply Box"],
  ["Big Monsters", "Small Monsters"],
  ["Forced Equipment"],
  ["Zone Transition", "Player Spawn"],
];

const menu = [
  {
    label: "Quest",
    to: "/questparams",
    disabled: false,
    icon: quest,
  },
  {
    label: "Monsters",
    to: "/bigmonsters",
    disabled: false,
    icon: bigmonster,
  },
  {
    label: "Equipments",
    to: "/equipments",
    disabled: false,
    icon: equipment,
  },
  {
    label: "Maps",
    to: "/miscparams",
    disabled: false,
    icon: misc,
  },
];

const NavCategory = ({ children, selected, onClick }) => {
  return <div onClick={onClick}>{children}</div>;
};

const NavMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <nav className="flex-grow flex flex-col gap-y-3 font-source text-base">
      {menu.map((menuItem, idx) => {
        let selected = selectedCategory === idx;

        return (
          <NavCategory
            selected={idx === selectedCategory}
            onClick={() => setSelectedCategory(idx)}
          >
            <div
              className={`relative flex gap-x-2 ${
                selectedCategory === idx ? "bg-green-600" : ""
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
              <p className="w-full h-full pl-8 py-2 px-2 inline-block text-zinc-200 text-base">
                {menuItem.label}
              </p>
            </div>
            {selectedCategory === idx && (
              <ul>
                {subLinks[idx].map((subLink) => (
                  <p className="text-zinc-500">{subLink}</p>
                ))}
              </ul>
            )}
          </NavCategory>
        );
      })}
    </nav>
  );
};

export default NavMenu;
