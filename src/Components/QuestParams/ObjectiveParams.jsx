import { ReadMainObjective, ReadSubAObjective, ReadSubBObjective } from "../../Utils/QuestParams/objective_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { ItemsOptions } from "../../Data/items";
import { MonsterOptions } from "../../Data/monsters";
import { ObjectivesOptions } from "../../Data/objectives";

const ObjectiveParams = () => {

  const { questDataView } = useQuestData();
  
  const objOptions = ObjectivesOptions;
  const monsterOptions = MonsterOptions;
  const itemsOptions = ItemsOptions;

  //Main Params
  const [mainObj, setMainObj] = useState(ReadMainObjective(questDataView));
  const [subAObj, setSubAObj] = useState(ReadSubAObjective(questDataView));
  const [subBObj, setSubBObj] = useState(ReadSubBObjective(questDataView));

  return(
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
  );
}

export default ObjectiveParams;