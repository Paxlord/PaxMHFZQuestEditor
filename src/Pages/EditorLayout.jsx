import NavBar from "../Components/NavBar";
import { useQuestData } from "../Hooks/useQuestData";
import { Outlet } from "react-router-dom";

const EditorLayout = () => {
  return (
    <div className="flex flex-row h-[calc(100vh-30px)] mt-titlebar">
      <div className="backdrop-blur-sm bg-zinc-500 w-64 h-[calc(100%-5%)] m-4 p-4 flex flex-col shadow-xl rounded-md bg-opacity-60 ">
        <NavBar />
      </div>
      <div className="h-full w-[calc(100vw-16rem)] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default EditorLayout;
