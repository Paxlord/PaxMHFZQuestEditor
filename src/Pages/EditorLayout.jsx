import NavBar from "../Components/NavBar";
import { useQuestData } from "../Hooks/useQuestData";
import { Outlet } from "react-router-dom";

const EditorLayout = () => {
  return (
    <div className="flex flex-row h-[calc(100vh-30px)] mt-titlebar overflow-hidden">
      <div className="backdrop-blur-sm bg-zinc-500 w-64 shrink-0 h-[calc(100%-2rem)] m-4 p-4 flex flex-col shadow-xl rounded-md bg-opacity-60 overflow-y-auto">
        <NavBar />
      </div>
      <div className="flex-1 h-full overflow-auto min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default EditorLayout;
