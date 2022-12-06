import { useState } from "react";
import { useContext, createContext } from "react";

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

  
  return(
    <QuestDataContext.Provider value={{ questDataView, initData, setQuestDataView}}>
      {children}
    </QuestDataContext.Provider>
  )

}