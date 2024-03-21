import { useState } from "react";

const categories = ["Quest", "Monsters", "Equipment", "Map"];

const NavCategory = ({ children }) => {
  return <div>{children}</div>;
};

const NavMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <nav>
      {categories.map((title) => (
        <NavCategory>{title}</NavCategory>
      ))}
    </nav>
  );
};

export default NavMenu;
