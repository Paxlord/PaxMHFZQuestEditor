import { ReadDeathCount, ReadMainObjCurrency, ReadQuestFee, ReadSubACurrency, ReadSubBCurrency } from "../../Utils/QuestParams/currency_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { NumeralInput } from "../../Components/Form/InputComponent";
import Panel from "../../Components/Panel";


const CurrenciesParams = () => {

  const { questDataView } = useQuestData();

  const [mainCurr, setMainCurr] = useState(ReadMainObjCurrency(questDataView));
  const [subACurr, setSubACurr] = useState(ReadSubACurrency(questDataView));
  const [subBCurr, setSubBCurr] = useState(ReadSubBCurrency(questDataView));

  const [questFee, setQuestFee] = useState(ReadQuestFee(questDataView));
  const [deathCount, setDeathCount] = useState(ReadDeathCount(questDataView));

  return(
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
  )
}

export default CurrenciesParams;