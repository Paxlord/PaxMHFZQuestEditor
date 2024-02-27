import {
  ReadMainObjective,
  ReadSubAObjective,
  ReadSubBObjective,
  WriteMainObjective,
  WriteSubAObjective,
  WriteSubBObjective,
} from "../../Utils/QuestParams/objective_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { Items, ItemsOptions } from "../../Data/items";
import { MonsterOptions } from "../../Data/monsters";
import { ObjectivesOptions, ObjectiveToCategory } from "../../Data/objectives";
import {
  ReadDeathCount,
  ReadMainObjCurrency,
  ReadQuestFee,
  ReadSubACurrency,
  ReadSubBCurrency,
  WriteDeathCount,
  WriteMainCurrency,
  WriteQuestFee,
  WriteSubACurrency,
  WriteSubBCurrency,
} from "../../Utils/QuestParams/currency_utils";
import { useImmer } from "use-immer";
import encartsvg from "../../assets/mhfencart.svg";

const ObjectiveParams = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const objOptions = ObjectivesOptions;
  const monsterOptions = MonsterOptions;
  const itemsOptions = ItemsOptions;

  //Main Params
  const [mainObj, setMainObj] = useState(() =>
    ReadMainObjective(questDataView)
  );
  const [subAObj, setSubAObj] = useState(() =>
    ReadSubAObjective(questDataView)
  );
  const [subBObj, setSubBObj] = useState(() =>
    ReadSubBObjective(questDataView)
  );

  const [mainCurr, setMainCurr] = useImmer(() =>
    ReadMainObjCurrency(questDataView)
  );
  const [subACurr, setSubACurr] = useImmer(() =>
    ReadSubACurrency(questDataView)
  );
  const [subBCurr, setSubBCurr] = useImmer(() =>
    ReadSubBCurrency(questDataView)
  );

  const updateZenny = (updateFunction, value) => {
    updateFunction((draft) => {
      draft.zennyReward = parseInt(value);
    });
  };

  const updatePoints = (updateFunction, value) => {
    updateFunction((draft) => {
      draft.pointReward = parseInt(value);
    });
  };

  const updateMainObjType = (newVal) => {
    let intVal = parseInt(newVal);
    let obj = {
      objType: intVal,
      objTarget: 0,
      objAmount: 0,
      categories: ObjectiveToCategory(parseInt(intVal)),
    };
    if (intVal === 0) {
      setMainCurr((draft) => {
        draft.pointReward = 0;
        draft.zennyReward = 0;
      });
    }
    setMainObj(obj);
  };

  const updateMainAmount = (amount) => {
    let intAmount = parseInt(amount);

    if (mainObj.categories[1] === "Damage") intAmount = Math.floor(intAmount);

    let obj = { ...mainObj, objAmount: intAmount };
    setMainObj(obj);
  };

  const updateMainTarget = (targetId) => {
    let intTarget = parseInt(targetId);
    let obj = { ...mainObj, objTarget: intTarget };
    setMainObj(obj);
  };

  const updateSubAObjType = (newVal) => {
    let intVal = parseInt(newVal);
    let obj = {
      objType: intVal,
      objTarget: 0,
      objAmount: 0,
      categories: ObjectiveToCategory(parseInt(intVal)),
    };
    if (intVal === 0) {
      setSubACurr((draft) => {
        draft.pointReward = 0;
        draft.zennyReward = 0;
      });
    }
    setSubAObj(obj);
  };

  const updateSubAAmount = (amount) => {
    let intAmount = parseInt(amount);

    if (subAObj.categories[1] === "Damage") intAmount = Math.floor(intAmount);

    let obj = { ...subAObj, objAmount: intAmount };
    setSubAObj(obj);
  };

  const updateSubATarget = (targetId) => {
    let intTarget = parseInt(targetId);
    let obj = { ...subAObj, objTarget: intTarget };
    setSubAObj(obj);
  };

  const updateSubBObjType = (newVal) => {
    let intVal = parseInt(newVal);
    let obj = {
      objType: intVal,
      objTarget: 0,
      objAmount: 0,
      categories: ObjectiveToCategory(parseInt(intVal)),
    };
    if (intVal === 0) {
      setSubBCurr((draft) => {
        draft.pointReward = 0;
        draft.zennyReward = 0;
      });
    }
    setSubBObj(obj);
  };

  const updateSubBAmount = (amount) => {
    let intAmount = parseInt(amount);

    if (subBObj.categories[1] === "Damage") intAmount = Math.floor(intAmount);

    let obj = { ...subBObj, objAmount: intAmount };
    setSubBObj(obj);
  };

  const updateSubBTarget = (targetId) => {
    let intTarget = parseInt(targetId);
    let obj = { ...subBObj, objTarget: intTarget };
    setSubBObj(obj);
  };

  const saveToDataview = () => {
    let newDv = WriteMainObjective(questDataView, mainObj);
    newDv = WriteSubAObjective(newDv, subAObj);
    newDv = WriteSubBObjective(newDv, subBObj);
    newDv = WriteMainCurrency(newDv, mainCurr);
    newDv = WriteSubACurrency(newDv, subACurr);
    newDv = WriteSubBCurrency(newDv, subBCurr);
    console.log(newDv);
    setQuestDataView(newDv);
  };

  return (
    <Panel onSave={saveToDataview}>
      <div className="relative flex items-center mb-8">
        <img
          src={encartsvg}
          className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4"
        />
        <h1 className=" text-xl font-monsterhunter text-white">
          Objective Parameters
        </h1>
      </div>
      <div className="flex flex-col justify-evenly gap-y-6">
        <div className="flex-1 flex gap-x-3 ">
          <SelectComponent
            options={objOptions}
            defaultValue={mainObj.objType}
            title="Main Objective"
            onChange={updateMainObjType}
          />

          {mainObj.categories[1] !== "None" && (
            <NumeralInput
              size={"sm"}
              label={"Amount"}
              onChange={updateMainAmount}
              defaultValue={mainObj.objAmount}
            />
          )}

          {mainObj.categories[0] === "Monster" && (
            <SelectComponent
              className="flex-1"
              onChange={updateMainTarget}
              options={
                mainObj.categories[0] === "Monster"
                  ? monsterOptions
                  : itemsOptions
              }
              defaultValue={mainObj.objTarget}
              title="Target"
            />
          )}

          {mainObj.categories[0] === "Item" && (
            <NumeralInput
              size={"full"}
              label={`Target (${
                Items[mainObj.objTarget]
                  ? Items[mainObj.objTarget]
                  : "Unknown Item ID"
              })`}
              onChange={updateMainTarget}
              defaultValue={mainObj.objTarget}
            />
          )}

          {mainObj.categories[0] === "Numeral" && (
            <NumeralInput
              onChange={updateMainTarget}
              label={"Target"}
              defaultValue={mainObj.objTarget}
            />
          )}

          {mainObj.objType !== 0 && (
            <>
              <NumeralInput
                label="Zenny Reward"
                defaultValue={mainCurr.zennyReward}
                onChange={(value) => updateZenny(setMainCurr, value)}
              />
              <NumeralInput
                label="Points Reward"
                defaultValue={mainCurr.pointReward}
                onChange={(value) => updatePoints(setMainCurr, value)}
              />
            </>
          )}
        </div>
        <div className="flex-1 flex gap-x-3">
          <SelectComponent
            options={objOptions}
            defaultValue={subAObj.objType}
            title="SubA Objective"
            onChange={updateSubAObjType}
          />

          {subAObj.categories[1] !== "None" && (
            <NumeralInput
              size={"sm"}
              label={"Amount"}
              onChange={updateSubAAmount}
              defaultValue={subAObj.objAmount}
            />
          )}

          {subAObj.categories[0] === "Monster" && (
            <SelectComponent
              className="flex-1"
              onChange={updateSubATarget}
              options={
                subAObj.categories[0] === "Monster"
                  ? monsterOptions
                  : itemsOptions
              }
              defaultValue={subAObj.objTarget}
              title="Target"
            />
          )}

          {subAObj.categories[0] === "Item" && (
            <NumeralInput
              size={"full"}
              label={`Target (${
                Items[subAObj.objTarget]
                  ? Items[subAObj.objTarget]
                  : "Unknown Item ID"
              })`}
              onChange={updateSubATarget}
              defaultValue={subAObj.objTarget}
            />
          )}

          {subAObj.categories[0] === "Numeral" && (
            <NumeralInput
              onChange={updateSubATarget}
              label={"Target"}
              defaultValue={subAObj.objTarget}
            />
          )}

          {subAObj.objType !== 0 && (
            <>
              <NumeralInput
                label="Zenny Reward"
                defaultValue={subACurr.zennyReward}
                onChange={(value) => updateZenny(setSubACurr, value)}
              />
              <NumeralInput
                label="Points Reward"
                defaultValue={subACurr.pointReward}
                onChange={(value) => updatePoints(setSubACurr, value)}
              />
            </>
          )}
        </div>
        <div className="flex-1 flex gap-x-3">
          <SelectComponent
            options={objOptions}
            defaultValue={subBObj.objType}
            title="SubB Objective"
            onChange={updateSubBObjType}
          />

          {subBObj.categories[1] !== "None" && (
            <NumeralInput
              size={"sm"}
              label={"Amount"}
              onChange={updateSubBAmount}
              defaultValue={subBObj.objAmount}
            />
          )}

          {subBObj.categories[0] === "Monster" && (
            <SelectComponent
              className="flex-1"
              onChange={updateSubBTarget}
              options={
                subBObj.categories[0] === "Monster"
                  ? monsterOptions
                  : itemsOptions
              }
              defaultValue={subBObj.objTarget}
              title="Target"
            />
          )}

          {subBObj.categories[0] === "Item" && (
            <NumeralInput
              size={"full"}
              label={`Target (${
                Items[subBObj.objTarget]
                  ? Items[subBObj.objTarget]
                  : "Unknown Item ID"
              })`}
              onChange={updateSubBTarget}
              defaultValue={subBObj.objTarget}
            />
          )}

          {subBObj.categories[0] === "Numeral" && (
            <NumeralInput
              onChange={updateSubBTarget}
              label={"Target"}
              defaultValue={subBObj.objTarget}
            />
          )}

          {subBObj.objType !== 0 && (
            <>
              <NumeralInput
                label="Zenny Reward"
                defaultValue={subBCurr.zennyReward}
                onChange={(value) => updateZenny(setSubBCurr, value)}
              />
              <NumeralInput
                label="Points Reward"
                defaultValue={subBCurr.pointReward}
                onChange={(value) => updatePoints(setSubBCurr, value)}
              />
            </>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default ObjectiveParams;
