import { ReadMainObjective, ReadSubAObjective, ReadSubBObjective, WriteMainObjective, WriteSubAObjective, WriteSubBObjective } from "../../Utils/QuestParams/objective_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { ItemsOptions } from "../../Data/items";
import { MonsterOptions } from "../../Data/monsters";
import { ObjectivesOptions, ObjectiveToCategory } from "../../Data/objectives";

const ObjectiveParams = () => {

  const { questDataView, setQuestDataView } = useQuestData();
  
  const objOptions = ObjectivesOptions;
  const monsterOptions = MonsterOptions;
  const itemsOptions = ItemsOptions;

  //Main Params
  const [mainObj, setMainObj] = useState(() => ReadMainObjective(questDataView));
  const [subAObj, setSubAObj] = useState(() => ReadSubAObjective(questDataView));
  const [subBObj, setSubBObj] = useState(() => ReadSubBObjective(questDataView));

  const updateMainObjType = (newVal) => {
    let intVal = parseInt(newVal);
    let obj = { objType: intVal, objTarget: 0, objAmount: 0, categories: ObjectiveToCategory(parseInt(intVal))};
    setMainObj(obj);
  }

  const updateMainAmount = (amount) => {
    let intAmount = parseInt(amount);

    if (mainObj.categories[1] === "Damage")
      intAmount = Math.floor(intAmount);

    let obj = { ...mainObj, objAmount: intAmount };
    setMainObj(obj);
  }

  const updateMainTarget = (targetId) => {
    let intTarget = parseInt(targetId);
    let obj = { ...mainObj, objTarget: intTarget };
    setMainObj(obj);
  }

  const updateSubAObjType = (newVal) => {
    let intVal = parseInt(newVal);
    let obj = { objType: intVal, objTarget: 0, objAmount: 0, categories: ObjectiveToCategory(parseInt(intVal))};
    setSubAObj(obj);
  }

  const updateSubAAmount = (amount) => {
    let intAmount = parseInt(amount);

    
    if (subAObj.categories[1] === "Damage")
      intAmount = Math.floor(intAmount);


    let obj = { ...subAObj, objAmount: intAmount };
    setSubAObj(obj);
  }

  const updateSubATarget = (targetId) => {
    let intTarget = parseInt(targetId);
    let obj = { ...subAObj, objTarget: intTarget };
    setSubAObj(obj);
  }

  const updateSubBObjType = (newVal) => {
    let intVal = parseInt(newVal);
    let obj = { objType: intVal, objTarget: 0, objAmount: 0, categories: ObjectiveToCategory(parseInt(intVal))};
    setSubBObj(obj);
  }

  const updateSubBAmount = (amount) => {
    let intAmount = parseInt(amount);

    if (subBObj.categories[1] === "Damage")
      intAmount = Math.floor(intAmount);

    let obj = { ...subBObj, objAmount: intAmount };
    setSubBObj(obj);
  }

  const updateSubBTarget = (targetId) => {
    let intTarget = parseInt(targetId);
    let obj = { ...subBObj, objTarget: intTarget };
    setSubBObj(obj);
  }

  const saveToDataview = () => {
    let newDv = WriteMainObjective(questDataView, mainObj);
    newDv = WriteSubAObjective(newDv, subAObj);
    newDv = WriteSubBObjective(newDv, subBObj);
    console.log(newDv);
    setQuestDataView(newDv);
  }

  return(
    <Panel onSave={saveToDataview}>
        <h1>Main Parameters</h1>
        <div className="flex justify-between gap-x-3 mt-1">
          <div className="flex-1 ">
            <SelectComponent options={objOptions} defaultValue={mainObj.objType} title="Main Objective" onChange={updateMainObjType}/>

            {(mainObj.categories[1]!=="None") && <NumeralInput label={"Amount"} onChange={updateMainAmount} defaultValue={mainObj.objAmount}/>}

            {((mainObj.categories[0]==="Monster") || (mainObj.categories[0]==="Item" )) && 
              <SelectComponent onChange={updateMainTarget} options={mainObj.categories[0]==="Monster"?monsterOptions:itemsOptions} defaultValue={mainObj.objTarget} title="Target" />}

            {(mainObj.categories[0]==="Numeral") && 
              <NumeralInput  onChange={updateMainTarget} label={"Target"} defaultValue={mainObj.objTarget}/>}
          </div>
          <div className="flex-1 ">
            <SelectComponent options={objOptions} defaultValue={subAObj.objType} title="SubA Objective" onChange={updateSubAObjType} />

            {(subAObj.categories[1]!=="None") && <NumeralInput label={"Amount"} onChange={updateSubAAmount} defaultValue={subAObj.objAmount}/>}

            {((subAObj.categories[0]==="Monster") || (subAObj.categories[0]==="Item" )) && 
              <SelectComponent onChange={updateSubATarget} options={subAObj.categories[0]==="Monster"?monsterOptions:itemsOptions} defaultValue={subAObj.objTarget} title="Target" />}

            {(subAObj.categories[0]==="Numeral") && 
              <NumeralInput  onChange={updateSubATarget} label={"Target"} defaultValue={subAObj.objTarget}/>}
          </div>
          <div className="flex-1 ">
            <SelectComponent options={objOptions} defaultValue={subBObj.objType} title="SubB Objective" onChange={updateSubBObjType} />

            {(subBObj.categories[1]!=="None") && <NumeralInput label={"Amount"}  onChange={updateSubBAmount} defaultValue={subBObj.objAmount}/>}

            {((subBObj.categories[0]==="Monster") || (subBObj.categories[0]==="Item" )) && 
              <SelectComponent onChange={updateSubBTarget} options={subBObj.categories[0]==="Monster"?monsterOptions:itemsOptions} defaultValue={subBObj.objTarget} title="Target" />}

            {(subBObj.categories[0]==="Numeral") && 
              <NumeralInput  onChange={updateSubBTarget} label={"Target"} defaultValue={subBObj.objTarget}/>}
          </div>
        </div>
      </Panel>
  );
}

export default ObjectiveParams;