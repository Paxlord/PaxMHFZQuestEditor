import { useState } from "react";

import bigmonster from "../assets/bigmonster.webp";
import smallmonster from "../assets/smallmonster.webp";
import gatherables from "../assets/gatherables.webp";
import misc from "../assets/misc.webp";
import quest from "../assets/quest.webp";
import questrewards from "../assets/questrewards.webp";
import queststrings from "../assets/queststrings.webp";
import equipment from "../assets/equipment.webp";
import { Link } from "react-router-dom";

// {
//   path: "/questparams",
//   element: <QuestParams />,
// },
// {
//   path: "/miscparams",
//   element: <MiscParams />,
// },
// {
//   path: "/bigmonsters",
//   element: <BigMonsters />,
// },
// {
//   path: "/smallmonsters",
//   element: <SmallMonsters />,
// },
// {
//   path: "/gatherables",
//   element: <Gatherables />,
// },
// {
//   path: "/questrewards",
//   element: <QuestRewards />,
// },
// {
//   path: "/queststrings",
//   element: <QuestStrings />,
// },
// {
//   path: "/equipments",
//   element: <EquipmentRestriction />,
// },

const categories = ["Quest", "Monsters", "Equipment", "Map", "Dev"];
const subLinks = [
  [
    { name: "Quest Parameters", link: "/questparams" },
    { name: "Quest Rewards", link: "/questrewards" },
    { name: "Quest Strings", link: "/queststrings" },
    { name: "Misc.", link: "/miscparams" },
    { name: "Supply box", link: "/supplybox" },
  ],
  [
    { name: "Big Monsters", link: "/bigmonsters" },
    { name: "Small Monsters", link: "/smallmonsters" },
  ],
  [{ name: "Forced Equipment", link: "/equipments" }],
  [
    { name: "Zone Transition", link: "/zonetransition" },
    { name: "Player Spawn", link: "/playerspawn" },
  ],
  [{ name: "Test", link: "/test" }],
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
  {
    label: "Dev",
    to: "/dev",
    disabled: false,
    icon: misc,
  },
];

const NavCategory = ({ children, selected, onClick }) => {
  return <div onClick={onClick}>{children}</div>;
};

const NavMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

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
              <ul className="flex flex-col gap-y-2 py-2">
                {subLinks[idx].map((subLink) => (
                  <Link
                    to={subLink.link}
                    onClick={() => setSelectedSubCategory(subLink.link)}
                    className={` ml-2
                        transition ease-in-out text-sm hover:text-green-500
                      ${
                        selectedSubCategory === subLink.link
                          ? "text-green-500 translate-x-2"
                          : "text-zinc-100 "
                      }`}
                  >
                    {subLink.name}
                  </Link>
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
