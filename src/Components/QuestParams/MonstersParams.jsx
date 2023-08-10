import React from 'react';
import { ReadMonsterParams, WriteMonsterParams } from "../../Utils/QuestParams/monsters_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { DifficultiesOptions } from "../../Data/difficulties";
import { useImmer } from 'use-immer';
import encartsvg from '../../assets/mhfencart.svg'



const MonstersParams = () => {

  const { questDataView, setQuestDataView } = useQuestData();
  const difficultiesOptions = DifficultiesOptions;

  const [monsterParams, setMonsterParams] = useImmer(() => ReadMonsterParams(questDataView));

  const updateSize = (value) => {
    setMonsterParams(draft => {
      draft.size = parseInt(value);
    })
  }

  const updateWdth = (value) => {
    setMonsterParams(draft => {
      draft.wdth = parseInt(value);
    })
  }

  const updateDifficulty = (value) => {
    setMonsterParams(draft => {
      draft.difficulty = parseInt(value);
    })
  }

  const onSave = () => {
    let newDv = WriteMonsterParams(questDataView, monsterParams);
    setQuestDataView(newDv);
  }

  return (
    <Panel onSave={() => onSave()}>
        <div className="relative flex items-center mb-8">
          <img src={encartsvg} className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4" />
          <h1 className=" text-xl font-monsterhunter text-white">Monster Parameters</h1>
        </div>
        <div className="flex flex-wrap gap-x-3 mt-1 items-center">
          <div className="flex-1">
            <NumeralInput label="Size(in %)" defaultValue={monsterParams.size} onChange={(value) => updateSize(value)} />
          </div>
          <div className="flex-1">
            <SelectComponent options={difficultiesOptions} defaultValue={monsterParams.difficulty} title="Difficulty"  onChange={(value) => updateDifficulty(value)}/>
          </div>
          <div className='flex-1'></div>
        </div>
      </Panel>
  )
}

export default MonstersParams;
