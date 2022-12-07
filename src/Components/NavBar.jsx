import { useState } from "react";
import { Link } from "react-router-dom";

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

  const onLinkClick = (index) => {
    setSelectedIndex(index);
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
    </nav>
  );

}

export default NavBar