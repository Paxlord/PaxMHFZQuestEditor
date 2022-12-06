import { useQuestData } from "../Hooks/useQuestData";
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api'

const OpenFile = () => {

  const { initData } = useQuestData();

  const openQuestData = async () => {
    let filePath = await open({
      multiple: false,
      filters: [{
        name: "Quest Bin",
        extensions: ['bin']
      }]
    });

    let dataArray = await invoke("file_path_to_byte_array", { path: filePath});
    initData(dataArray);
  }

  return(
    <div className="dark:bg-slate-700 h-[calc(100vh-30px)] gap-y-8 w-screen mt-titlebar text-white flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl uppercase font-bold">Welcome to PaxQuestEditor</h1>
      <h2 className="text-center text-lg text-slate-200">To access the editor, press the button and open a decompressed quest file of your choosing...</h2>
      <button onClick={() => openQuestData()} className="transition ease-in-out  bg-violet-500 py-2 px-4 rounded-sm block shadow-sm hover:bg-violet-600 font-medium active:bg-violet-700">Open quest file</button>
    </div>
  );

}

export default OpenFile;