import { useQuestData } from "../Hooks/useQuestData";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

const OpenFile = () => {
  const { initData } = useQuestData();

  const openQuestData = async () => {
    let filePath = await open({
      multiple: false,
      filters: [
        {
          name: "Quest Bin",
          extensions: ["bin"],
        },
      ],
    });

    let dataArray = await invoke("file_path_to_byte_array", { path: filePath });
    let og_filename = filePath.split("\\").pop();
    initData(dataArray, og_filename);
  };

  return (
    <div className="bg-zinc-500 mx-16 bg-opacity-60 backdrop-blur-sm rounded p-4 h-[calc(100vh-8rem)] mt-16 self-center shadow-lg  gap-y-8 text-white flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl uppercase font-bold">
        Welcome to PaxQuestEditor
      </h1>
      <h2 className="text-center text-lg text-slate-200">
        To access the editor, press the button and open a decompressed quest
        file of your choosing...
      </h2>
      <button
        onClick={() => openQuestData()}
        className="transition px-4 py-2 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700"
      >
        Open quest file
      </button>
    </div>
  );
};

export default OpenFile;
