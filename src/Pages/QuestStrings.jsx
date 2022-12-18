import { useState } from "react";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadQuestStrings } from "../Utils/QuestParams/string_utils";

const QuestStrings = () => {
  
  const { questDataView } = useQuestData();
  const [questStrings, setQuestStrings ] = useState(ReadQuestStrings(questDataView));

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <Panel>
        {
          questStrings.map((string) => {
            return <p>{string.string}</p>
          })
        }
      </Panel>
    </div>
  )
}

export default QuestStrings;