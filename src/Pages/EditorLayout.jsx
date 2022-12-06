import NavBar from "../Components/NavBar";
import { useQuestData } from "../Hooks/useQuestData"
import { Outlet } from 'react-router-dom';


const EditorLayout = () => {

  const { questDataView } = useQuestData();

  return(
    <div className="flex flex-row h-[calc(100vh-30px)] mt-titlebar ">
      <div className="bg-zinc-700 w-56 h-full p-4 flex flex-col"> 
        <NavBar />
      </div>
      <div className="bg-zinc-600 h-full flex-grow">
        <Outlet />
      </div>
    </div>
  )
}

export default EditorLayout