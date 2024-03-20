import React from "react";
import {
  ReadMonsterParams,
  WriteMonsterParams,
} from "../../Utils/QuestParams/monsters_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { DifficultiesOptions } from "../../Data/difficulties";
import { useImmer } from "use-immer";
import encartsvg from "../../assets/mhfencart.svg";

const computeDifficultyDefaultValue = (monsterParams, difficultiesOptions) => {
  let isInDifficulty =
    difficultiesOptions.filter(
      (option) => parseInt(option.value) === monsterParams.difficulty
    ).length > 0;

  const returnVal = isInDifficulty ? monsterParams.difficulty : -1;
  return returnVal;
};

const MonstersParams = () => {
  const { questDataView, setQuestDataView } = useQuestData();
  const difficultiesOptions = DifficultiesOptions;
  const [monsterParams, setMonsterParams] = useImmer(() =>
    ReadMonsterParams(questDataView)
  );

  const [selectedOption, setSelectedOption] = useState(
    computeDifficultyDefaultValue(monsterParams, difficultiesOptions)
  );

  const updateSize = (value) => {
    setMonsterParams((draft) => {
      draft.size = parseInt(value);
    });
  };

  const updateWdth = (value) => {
    setMonsterParams((draft) => {
      draft.wdth = parseInt(value);
    });
  };

  const updateDifficulty = (value) => {
    setMonsterParams((draft) => {
      draft.difficulty = parseInt(value);
    });
  };

  const onSave = () => {
    let newDv = WriteMonsterParams(questDataView, monsterParams);
    setQuestDataView(newDv);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(parseInt(value));
    if (parseInt(value) !== -1) {
      updateDifficulty(value);
    }
  };

  return (
    <Panel onSave={() => onSave()}>
      <div className="relative flex items-center mb-8">
        <img
          src={encartsvg}
          className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4"
        />
        <h1 className=" text-xl font-monsterhunter text-white">
          Monster Parameters
        </h1>
      </div>
      <div className="flex gap-x-3 mt-1 items-center">
        <NumeralInput
          label="Size(in %)"
          defaultValue={monsterParams.size}
          onChange={(value) => updateSize(value)}
        />
        <SelectComponent
          options={difficultiesOptions}
          defaultValue={selectedOption}
          title="Difficulty"
          onChange={handleSelectChange}
        />
        {selectedOption === -1 && (
          <NumeralInput
            label="Custom Stat Table"
            defaultValue={monsterParams.difficulty}
            onChange={(value) => updateDifficulty(value)}
          />
        )}
      </div>
    </Panel>
  );
};

export default MonstersParams;
