import { useEffect } from "react";
import { useState } from "react";
import { NumeralInput } from "../Components/Form/InputComponent";
import SelectComponent from "../Components/Form/SelectComponent";
import Panel from "../Components/Panel";
import { DifficultiesOptions } from "../Data/difficulties";
import { ItemsOptions } from "../Data/items";
import { MonsterOptions } from "../Data/monsters";
import { ObjectivesOptions } from "../Data/objectives";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadDeathCount, ReadMainObjCurrency, ReadQuestFee, ReadSubACurrency, ReadSubBCurrency } from "../Utils/QuestParams/currency_utils";
import { ReadMonsterParams } from "../Utils/QuestParams/monsters_utils";
import { ReadMainObjective, ReadSubAObjective, ReadSubBObjective } from "../Utils/QuestParams/objective_utils";

const QuestParams = () => {

  const { questDataView } = useQuestData();
  
  const objOptions = ObjectivesOptions;
  const monsterOptions = MonsterOptions;
  const itemsOptions = ItemsOptions;
  const difficultiesOptions = DifficultiesOptions;

  //Main Params
  const [mainObj, setMainObj] = useState(ReadMainObjective(questDataView));
  const [subAObj, setSubAObj] = useState(ReadSubAObjective(questDataView));
  const [subBObj, setSubBObj] = useState(ReadSubBObjective(questDataView));

  const [mainCurr, setMainCurr] = useState(ReadMainObjCurrency(questDataView));
  const [subACurr, setSubACurr] = useState(ReadSubACurrency(questDataView));
  const [subBCurr, setSubBCurr] = useState(ReadSubBCurrency(questDataView));

  const [questFee, setQuestFee] = useState(ReadQuestFee(questDataView));
  const [deathCount, setDeathCount] = useState(ReadDeathCount(questDataView));

  const [monsterParams, setMonsterParams] = useState(ReadMonsterParams(questDataView));

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <Panel>
        <h1>Main Parameters</h1>
        <div className="flex justify-between gap-x-3 mt-1">
          <div className="flex-1 ">
            <SelectComponent options={objOptions} defaultValue={mainObj.objType} title="Main Objective" />

            {(mainObj.categories[1]!=="None") && <NumeralInput label={"Amount"} defaultValue={mainObj.categories[1]==="Damage"?(mainObj.objAmount*100):mainObj.objAmount}/>}

            {((mainObj.categories[0]==="Monster") || (mainObj.categories[0]==="Item" )) && 
              <SelectComponent options={mainObj.categories[0]==="Monster"?monsterOptions:itemsOptions} defaultValue={mainObj.objTarget} title="Target" />}

            {(mainObj.categories[0]==="Numeral") && 
              <NumeralInput label={"Target"} defaultValue={mainObj.objTarget}/>}
          </div>
          <div className="flex-1 ">
            <SelectComponent options={objOptions} defaultValue={subAObj.objType} title="SubA Objective" />

            {(subAObj.categories[1]!=="None") && <NumeralInput label={"Amount"} defaultValue={subAObj.categories[1]==="Damage"?(subAObj.objAmount*100):subAObj.objAmount}/>}

            {((subAObj.categories[0]==="Monster") || (subAObj.categories[0]==="Item" )) && 
              <SelectComponent options={subAObj.categories[0]==="Monster"?monsterOptions:itemsOptions} defaultValue={subAObj.objTarget} title="Target" />}

            {(subAObj.categories[0]==="Numeral") && 
              <NumeralInput label={"Target"} defaultValue={subAObj.objTarget}/>}
          </div>
          <div className="flex-1 ">
            <SelectComponent options={objOptions} defaultValue={subBObj.objType} title="SubB Objective" />

            {(subBObj.categories[1]!=="None") && <NumeralInput label={"Amount"} defaultValue={subBObj.categories[1]==="Damage"?(subBObj.objAmount*100):subBObj.objAmount}/>}

            {((subBObj.categories[0]==="Monster") || (subBObj.categories[0]==="Item" )) && 
              <SelectComponent options={subBObj.categories[0]==="Monster"?monsterOptions:itemsOptions} defaultValue={subBObj.objTarget} title="Target" />}

            {(subBObj.categories[0]==="Numeral") && 
              <NumeralInput label={"Target"} defaultValue={subBObj.objTarget}/>}
          </div>
        </div>
      </Panel>

      <Panel>
        <h2>Currency Parameters</h2>
        <div className="flex justify-between gap-x-3 mt-1">
          <div className="flex-1 flex-col flex gap-y-3">
            <NumeralInput label="Zenny Reward" defaultValue={mainCurr.zennyReward} />
            <NumeralInput label="Points Reward" defaultValue={mainCurr.pointReward} />
          </div>
          <div className="flex-1 flex-col flex gap-y-3">
            <NumeralInput label="Zenny Reward" defaultValue={subACurr.zennyReward} />
            <NumeralInput label="Points Reward" defaultValue={subACurr.pointReward} />
          </div>
          <div className="flex-1 flex-col flex gap-y-3">
            <NumeralInput label="Zenny Reward" defaultValue={subBCurr.zennyReward} />
            <NumeralInput label="Points Reward" defaultValue={subBCurr.pointReward} />
          </div>
        </div>
        <div className="flex gap-x-3 mt-6">
            <div className="flex-1" ><NumeralInput label="Quest Fee" defaultValue={questFee} /></div>
            <div className="flex-1" ><NumeralInput label="Death Count" defaultValue={deathCount} /></div>
            <div className="flex-1" />
        </div>
      </Panel>

      <Panel>
        <h2>Global Monster Parameters</h2>
        <div className="flex flex-wrap gap-x-3 mt-1 items-center">
          <div className="flex-1">
            <NumeralInput label="Size(in %)" defaultValue={monsterParams.size} />
          </div>
          <div className="flex-1">
            <NumeralInput label="Size Variation" defaultValue={monsterParams.wdth} />
          </div>
          <div className="flex-1">
            <SelectComponent options={difficultiesOptions} defaultValue={monsterParams.difficulty} title="Difficulty" />
          </div>
          <div className="flex-1">
            <NumeralInput label="Hardcore?" defaultValue={monsterParams.hardcoreA} />
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default QuestParams;