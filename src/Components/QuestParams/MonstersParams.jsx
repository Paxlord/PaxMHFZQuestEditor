import React from 'react';
import { ReadMonsterParams } from "../../Utils/QuestParams/monsters_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { DifficultiesOptions } from "../../Data/difficulties";


const MonstersParams = () => {

  const { questDataView } = useQuestData();
  const difficultiesOptions = DifficultiesOptions;


  const [monsterParams, setMonsterParams] = useState(ReadMonsterParams(questDataView));

  return (
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
        </div>
      </Panel>
  )
}

export default MonstersParams;
