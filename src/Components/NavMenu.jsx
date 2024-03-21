import { useState } from "react";

const categories = ["Quest", "Monsters", "Equipment", "Map"];

const NavCategory = ({ children, selected, onClick }) => {
  return (
    <div
      className={`${selected ? "text-green-500" : "text-white"}`}
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
          {title}
        </NavCategory>
      ))}
    </nav>
  );
};

export default NavMenu;
