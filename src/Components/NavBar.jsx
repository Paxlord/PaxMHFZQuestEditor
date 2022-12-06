import { useState } from "react";
import { Link } from "react-router-dom";

const menu = [
  {
    label: "Quest Params",
    to: "/questparams"
  },
  {
    label: "Big Monsters",
    to: "/bigmonsters",
  },
  {
    label: "Small Monsters",
    to: "/smallmonsters",
  },
  {
    label: "Gatherables",
    to: "/gatherables",
  },
  {
    label: "Quest Rewards",
    to: "/questrewards",
  },
  {
    label: "Quest Strings",
    to: "/queststrings",
  }
]


const NavBar = () => {

  const [selectedIndex, setSelectedIndex ] = useState(-1);

  const onLinkClick = (index) => {
    setSelectedIndex(index);
  }

  return(
    <nav className="flex flex-col mt-16 flex-grow">
      {menu.map((menuItem, idx) => {
        if(idx === selectedIndex)
          return <div className="transition ease-in-out font-medium text-violet-500 text-md py-4 px-2 rounded-sm cursor-default">{menuItem.label}</div>
        
        return <Link to={menuItem.to} onClick={() => onLinkClick(idx)} className="transition ease-in-out text-zinc-200 text-md hover:text-violet-500 py-4 px-2 rounded-sm cursor-pointer">{menuItem.label}</Link>
      })}
    </nav>
  );

}

export default NavBar