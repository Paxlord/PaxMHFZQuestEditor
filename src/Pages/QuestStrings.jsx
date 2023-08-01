import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { TextArea } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadQuestStrings, WriteStrings } from "../Utils/QuestParams/string_utils";
import encartsvg from '../assets/mhfencart.svg'


const StringsLabel = [
  {
    label:"Quest Title",
    rows: 2
  },
  {
    label:"Main Obj",
    rows: 1
  },
  {
    label:"Sub A Obj",
    rows: 1
  },
  {
    label:"Sub B Obj",
    rows: 1
  },
  {
    label:"Success Cond.",
    rows: 2
  },
  {
    label:"Failure Cond.",
    rows: 2
  },
  {
    label:"Quest Giver",
    rows: 1
  },
  {
    label:"Description",
    rows: 10
  },
]

const QuestStrings = () => {
  
  const { questDataView, setQuestDataView } = useQuestData();
  const [questStrings, setQuestStrings ] = useImmer(() => ReadQuestStrings(questDataView));

  const updateString = (idx, string) => {
    setQuestStrings(draft => {
      draft[idx].string = string;
      if(string.length >= 0){
        if(string.charAt(string.length-1) !== '\x00'){
          draft[idx].string += "\x00";
        }
      }
    })
  }

  useEffect(() => {
    console.table(questStrings);
  }, [])

  const SaveStrings = () => {
    let dv = WriteStrings(questDataView, questStrings);
    setQuestDataView(dv);
  }

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <Panel onSave={() => SaveStrings()}>
        <div className="relative flex items-center mb-8">
          <img src={encartsvg} className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4" />
          <h1 className=" text-xl font-monsterhunter text-white">Quest Strings</h1>
        </div>
        <div className="gap-y-4 flex flex-col">
        {
          questStrings.map((string, idx) => {
            return(
              <TextArea label={StringsLabel[idx].label} rows={StringsLabel[idx].rows} defaultValue={string.string} chara_count={true} onChange={(value) => updateString(idx, value)} />
            )
          })
        }
        </div>
      </Panel>
    </div>
  )
}

export default QuestStrings;