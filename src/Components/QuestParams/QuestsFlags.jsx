import {
  ReadMainObjective,
  ReadSubAObjective,
  ReadSubBObjective,
} from "../../Utils/QuestParams/objective_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import {
  CheckBoxInput,
  NumeralInput,
} from "../../Components/Form/InputComponent";
import SelectComponent from "../../Components/Form/SelectComponent";
import Panel from "../../Components/Panel";
import { ItemsOptions } from "../../Data/items";
import { MonsterOptions } from "../../Data/monsters";
import { ObjectivesOptions } from "../../Data/objectives";
import {
  ReadQuestFlags1,
  ReadQuestFlags2,
  ReadQuestFlags3,
  WriteQuestFlags1,
  WriteQuestFlags2,
  WriteQuestFlags3,
} from "../../Utils/QuestParams/flag_utils";
import { useEffect } from "react";
import encartsvg from "../../assets/mhfencart.svg";

const QuestFlags = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [flagArray, setFlagArray] = useState(() =>
    ReadQuestFlags1(questDataView)
  );
  const [flagArray2, setFlagArray2] = useState(() =>
    ReadQuestFlags2(questDataView)
  );
  const [flagArray3, setFlagArray3] = useState(() =>
    ReadQuestFlags3(questDataView)
  );

  const toggleFlag1 = (idx) => {
    let tmp = flagArray.map((flagObj, i) => {
      if (i === idx) {
        return { ...flagObj, flag: !flagObj.flag };
      }

      return flagObj;
    });
    setFlagArray(tmp);
  };

  const toggleFlag2 = (idx) => {
    let tmp = flagArray2.map((flagObj, i) => {
      if (i === idx) {
        return { ...flagObj, flag: !flagObj.flag };
      }

      return flagObj;
    });
    setFlagArray2(tmp);
  };

  const toggleFlag3 = (idx) => {
    let tmp = flagArray3.map((flagObj, i) => {
      if (i === idx) {
        return { ...flagObj, flag: !flagObj.flag };
      }

      return flagObj;
    });
    setFlagArray3(tmp);
  };

  const OnSave = () => {
    let nDV = WriteQuestFlags1(questDataView, flagArray);
    nDV = WriteQuestFlags2(nDV, flagArray2);
    nDV = WriteQuestFlags3(nDV, flagArray3);
    setQuestDataView(nDV);
  };

  return (
    <Panel onSave={() => OnSave()}>
      <div className="relative flex items-center mb-8">
        <img
          src={encartsvg}
          className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4"
        />
        <h1 className=" text-xl font-monsterhunter text-white">Quest Flags</h1>
      </div>
      <div className="">
        <h2 className="font-medium text-lg text-green-500">Flag set 1</h2>
        <div className="flex justify-between gap-x-3 mt-1 mb-4 flex-wrap">
          {flagArray.map((flag, idx) => {
            return (
              <CheckBoxInput
                label={flag.label}
                defaultValue={flag.flag}
                onChange={() => toggleFlag1(idx)}
              />
            );
          })}
        </div>
        <h2 className="font-medium text-lg text-green-500">Flag set 2</h2>
        <div className="flex justify-between gap-x-3 mt-1 mb-4 flex-wrap">
          {flagArray2.map((flag, idx) => {
            return (
              <CheckBoxInput
                label={flag.label}
                defaultValue={flag.flag}
                onChange={() => toggleFlag2(idx)}
              />
            );
          })}
        </div>
        <h2 className="font-medium text-lg text-green-500">Flag set 3</h2>
        <div className="flex justify-between gap-x-3 mt-1 mb-4 flex-wrap">
          {flagArray3.map((flag, idx) => {
            return (
              <CheckBoxInput
                label={flag.label}
                defaultValue={flag.flag}
                onChange={() => toggleFlag3(idx)}
              />
            );
          })}
        </div>
      </div>
    </Panel>
  );
};

export default QuestFlags;
