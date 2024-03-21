import { useState } from "react";

const categories = ["Quest", "Monsters", "Equipment", "Map"];
const subLinks = [
  ["Params", "Rewards", "String", "Misc", "Supply Box"],
  ["Big Monsters", "Small Monsters"],
  ["Forced Equipment"],
  ["Zone Transition", "Player Spawn"],
];

const NavCategory = ({ children, selected, onClick }) => {
  return (
    <div
      className={`${selected ? "text-green-500" : "text-white"} cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const NavMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <nav>
      {categories.map((title, idx) => (
        <NavCategory
          selected={idx === selectedCategory}
          onClick={() => setSelectedCategory(idx)}
        >
          <p>{title}</p>
          {selectedCategory === idx && (
            <ul>
              {subLinks[idx].map((subLink) => (
                <p>{subLink}</p>
              ))}
            </ul>
          )}
        </NavCategory>
      ))}
    </nav>
  );
};

export default NavMenu;
