import { useEffect } from "react";
import { useState } from "react";
import { useContext, createContext } from "react";
import { save } from "@tauri-apps/api/dialog";
import { invoke } from '@tauri-apps/api';

const QuestDataContext = createContext(null);

export const useQuestData = () => useContext(QuestDataContext);

export const QuestDataProvider = ({children}) => {

  const [questBuffer, setQuestBuffer] = useState(null);
  const [questArrayData, setQuestArrayData] = useState(null);
  const [questDataView, setQuestDataView] = useState(null);

  const initData = (questArray) => {
    setQuestArrayData(questArray);
    let bufferArray = Uint8Array.from(questArray);
    setQuestBuffer(bufferArray);
    let dataview = new DataView(bufferArray.buffer);
    setQuestDataView(dataview);
  }

  const resetData = () => {
    setQuestDataView(null);
  }

  const saveDataToFile = async () => {

    let fileName = await save({
      filters: [{
        name: 'Quest Binary',
        extensions: ['bin']
      }]
    });

    console.log("filename ", fileName);
    let uintArray = new Uint8Array(questDataView.buffer) 
    let simpleArray = Array.from(uintArray);

    if(fileName)
      await invoke("save_byte_array_to_file", { path: fileName, bytes: simpleArray})

  }

  useEffect(() => {
    if(questDataView){
      console.log("Quest Data View Changed : ", questDataView);
    }
  }, [questDataView])
  
  return(
    <QuestDataContext.Provider value={{ questDataView, initData, setQuestDataView, resetData, saveDataToFile}}>
      {children}
    </QuestDataContext.Provider>
  )

}