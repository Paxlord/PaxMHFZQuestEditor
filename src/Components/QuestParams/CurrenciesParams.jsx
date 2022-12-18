import { ReadDeathCount, ReadMainObjCurrency, ReadQuestFee, ReadSubACurrency, ReadSubBCurrency, WriteDeathCount, WriteMainCurrency, WriteQuestFee, WriteSubACurrency, WriteSubBCurrency } from "../../Utils/QuestParams/currency_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../../Components/Form/InputComponent";
import Panel from "../../Components/Panel";


const CurrenciesParams = () => {

  const { questDataView, setQuestDataView } = useQuestData();

  const [mainCurr, setMainCurr] = useImmer(ReadMainObjCurrency(questDataView));
  const [subACurr, setSubACurr] = useImmer(ReadSubACurrency(questDataView));
  const [subBCurr, setSubBCurr] = useImmer(ReadSubBCurrency(questDataView));

  const [questFee, setQuestFee] = useState(ReadQuestFee(questDataView));
  const [deathCount, setDeathCount] = useState(ReadDeathCount(questDataView));

  const updateZenny= (updateFunction, value) => {
    updateFunction((draft) => {
      draft.zennyReward = parseInt(value);
    });
  }

  const updatePoints = (updateFunction, value) => {
    updateFunction((draft) => {
      draft.pointReward = parseInt(value);
    });
  }

  const onSave = () => {
    let newDV = WriteMainCurrency(questDataView, mainCurr);
    newDV = WriteSubACurrency(newDV, subACurr);
    newDV = WriteSubBCurrency(newDV, subBCurr);
    newDV = WriteDeathCount(newDV, deathCount);
    newDV = WriteQuestFee(newDV, questFee);
    setQuestDataView(newDV);
  }

  return(
    <Panel onSave={() => onSave()}>
        <h2>Currency Parameters</h2>
        <div className="flex justify-between gap-x-3 mt-1">
          <div className="flex-1 flex-col flex gap-y-3">
            <NumeralInput label="Zenny Reward" defaultValue={mainCurr.zennyReward} onChange={(value) => updateZenny(setMainCurr, value)}/>
            <NumeralInput label="Points Reward" defaultValue={mainCurr.pointReward} onChange={(value) => updatePoints(setMainCurr, value)} />
          </div>
          <div className="flex-1 flex-col flex gap-y-3">
            <NumeralInput label="Zenny Reward" defaultValue={subACurr.zennyReward} onChange={(value) => updateZenny(setSubACurr, value)}/>
            <NumeralInput label="Points Reward" defaultValue={subACurr.pointReward} onChange={(value) => updatePoints(setSubACurr, value)}/>
          </div>
          <div className="flex-1 flex-col flex gap-y-3">
            <NumeralInput label="Zenny Reward" defaultValue={subBCurr.zennyReward} onChange={(value) => updateZenny(setSubBCurr, value)}/>
            <NumeralInput label="Points Reward" defaultValue={subBCurr.pointReward} onChange={(value) => updatePoints(setSubBCurr, value)}/>
          </div>
        </div>
        <div className="flex gap-x-3 mt-6">
            <div className="flex-1" ><NumeralInput label="Quest Fee" defaultValue={questFee} onChange={(value) => setQuestFee(parseInt(value))}/></div>
            <div className="flex-1" ><NumeralInput label="Death Count" defaultValue={deathCount} onChange={(value) => setDeathCount(parseInt(value))}/></div>
            <div className="flex-1" />
        </div>
    </Panel>
  )
}

export default CurrenciesParams;