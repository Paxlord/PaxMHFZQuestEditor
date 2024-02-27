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
import {
  ReadMonsterVariant1,
  ReadMonsterVariant2,
  ReadMonsterVariant3,
  ReadMonsterVariant4,
  ReadMonsterVariant5,
  WriteMonsterVariants,
} from "../../Utils/QuestParams/variant_utils";
import { PanelTitle } from "../StyledComponents";

const VariantsPanel = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [variant1, setMonsterVariant] = useState(() =>
    ReadMonsterVariant1(questDataView)
  );
  const [variant2, setMonsterVariant2] = useState(() =>
    ReadMonsterVariant2(questDataView)
  );
  const [variant3, setMonsterVariant3] = useState(() =>
    ReadMonsterVariant3(questDataView)
  );
  const [variant4, setMonsterVariant4] = useState(() =>
    ReadMonsterVariant4(questDataView)
  );
  const [variant5, setMonsterVariant5] = useState(() =>
    ReadMonsterVariant5(questDataView)
  );

  const onSave = () => {
    let newDv = WriteMonsterVariants(
      questDataView,
      variant1,
      variant2,
      variant3,
      variant4,
      variant5
    );
    setQuestDataView(newDv);
  };

  return (
    <Panel onSave={() => onSave()}>
      <PanelTitle title="Monster Flags" />
      <div className="flex gap-x-3 mt-1 items-center">
        <NumeralInput
          label="Flag 1"
          defaultValue={variant1}
          onChange={(value) => setMonsterVariant(parseInt(value))}
        />
        <NumeralInput
          label="Flag 2"
          defaultValue={variant2}
          onChange={(value) => setMonsterVariant2(parseInt(value))}
        />
        <NumeralInput
          label="Flag 3 (Interception)"
          defaultValue={variant3}
          onChange={(value) => setMonsterVariant3(parseInt(value))}
        />
        <NumeralInput
          label="Flag 4 (Interception)"
          defaultValue={variant4}
          onChange={(value) => setMonsterVariant4(parseInt(value))}
        />
        <NumeralInput
          label="Flag 5 (Interception)"
          defaultValue={variant5}
          onChange={(value) => setMonsterVariant5(parseInt(value))}
        />
      </div>
    </Panel>
  );
};

export default VariantsPanel;
