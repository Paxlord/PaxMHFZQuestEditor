import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { TextArea } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadQuestStrings, WriteStrings } from "../Utils/QuestParams/string_utils";
import encartsvg from '../assets/mhfencart.svg'

import { Objectives, ObjectiveCategory, ObjectiveNumCategory } from "../Data/objectives";
import { Monsters } from "../Data/monsters";
import { Items } from "../Data/items";
import { ReadMainObjective, ReadSubAObjective, ReadSubBObjective } from "../Utils/QuestParams/objective_utils";
import { ReadQuestFlags1 } from "../Utils/QuestParams/flag_utils";
import { ReadDeathCount } from "../Utils/QuestParams/currency_utils";
import { ReadMandatoryFlag } from "../Utils/QuestParams/misc_utils";


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
    });
  }

  const getStringFromObj = (obj) => {
    let string = "";
    string += Objectives[obj.objType];
    string += " ";
    if (obj.categories[1] === "Amount"){
      string += obj.objAmount;
      string += " ";
    }
    if (obj.categories[0] === "Monster"){
      string += Monsters[obj.objTarget];
    }
    if (obj.categories[0] === "Item"){
      string += Items[obj.objTarget];
    }
    return string
  }

  const fillObjectives = () => {
    let mainObj = ReadMainObjective(questDataView);

    console.log(mainObj);

    let subAObj = ReadSubAObjective(questDataView);
    let subBObj = ReadSubBObjective(questDataView);

    updateString(1, getStringFromObj(mainObj));
    updateString(2, getStringFromObj(subAObj));
    updateString(3, getStringFromObj(subBObj));
    console.log("filled objectives");
  }

  const fillSuccessFailure = () => {
    let questflags = ReadQuestFlags1(questDataView);
    console.log(questflags);
    let deathCount = ReadDeathCount(questDataView);
    let failureString = questflags[3].flag?`Faint ${deathCount} Times\n`:`Rewards falls to 0z\n`;
    failureString += `Time Runs Out\x00`;

    let questMandat = ReadMandatoryFlag(questDataView);
    let questSubA = ReadSubAObjective(questDataView);
    let questSubB = ReadSubBObjective(questDataView);

    let successStringNotMandat = "Achieve Main Objective";
    
    //Very dirty to refactor
    if (questSubA.objType !== 0 || questSubB.objType !== 0){
      successStringNotMandat += " or\n";

      if (questSubA.objType !== 0 && questSubB.objType === 0){
        successStringNotMandat += "Sub-A Objective\x00";
      }
      if (questSubA.objType === 0 && questSubB.objType !== 0){
        successStringNotMandat += "Sub-B Objective\x00";
      }
      if (questSubA.objType !== 0 && questSubB.objType !== 0){
        successStringNotMandat += "Sub-A or Sub-B Objective\x00";
      }
    }

    let successStrings = {
      2: successStringNotMandat,
      3: "Achieve All Objectives\x00",
      4: "Achieve All Objectives\x00"
    }
    
    updateString(4, successStrings[questMandat]);
    updateString(5, failureString);

  }

  useEffect(() => {
    console.table(questStrings);
  }, [])

  const SanitizeNullEnding = () => {
    let sanitizedStrings = questStrings.map((stringObj) => {
      let newString = stringObj.string;
      if(newString.charAt(newString.length - 1) !== '\x00')
        newString += '\x00';
      return {...stringObj, string: newString }
    });

    return sanitizedStrings
  }

  const SaveStrings = () => {
    let finalStrings = SanitizeNullEnding();
    let dv = WriteStrings(questDataView, finalStrings);
    setQuestDataView(dv);
    setQuestStrings(ReadQuestStrings(dv));
  }

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <Panel onSave={() => SaveStrings()}>
        <div className="relative flex items-center mb-8">
          <img src={encartsvg} className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4" />
          <h1 className=" text-xl font-monsterhunter text-white">Quest Strings</h1>
        </div>
        <div className="mb-6 flex gap-x-3">
          <button onClick={() => {fillObjectives()}} className="transition px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700">Auto-fill Objective</button>
          <button onClick={() => {fillSuccessFailure()}} className="transition px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700">Auto-fill Success/Failure</button>
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