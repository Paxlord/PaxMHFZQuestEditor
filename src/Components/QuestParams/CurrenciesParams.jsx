import { ReadDeathCount, ReadMainObjCurrency, ReadQuestFee, ReadSubACurrency, ReadSubBCurrency, WriteDeathCount, WriteMainCurrency, WriteQuestFee, WriteSubACurrency, WriteSubBCurrency } from "../../Utils/QuestParams/currency_utils";
import { useQuestData } from "../../Hooks/useQuestData";
import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../../Components/Form/InputComponent";
import Panel from "../../Components/Panel";
import encartsvg from '../../assets/mhfencart.svg'
import { ReadMapVariant } from "../../Utils/QuestParams/flag_utils";
import { ReadMandatoryFlag, WriteMandatoryFlag } from "../../Utils/QuestParams/misc_utils";
import SelectComponent from "../Form/SelectComponent";

const mandatoryDropDownOptions = [
  {
  value: 2,
  label: "Main Obj. Only"
  },
  {
    value: 3,
    label: "Main + Sub A"
  },
  {
    value: 4,
    label: "Main + Sub A + Sub B"
  },
]

const CurrenciesParams = () => {

  const { questDataView, setQuestDataView } = useQuestData();

  const [questFee, setQuestFee] = useState(() => ReadQuestFee(questDataView));
  const [deathCount, setDeathCount] = useState(() => ReadDeathCount(questDataView));
  const [mapVariant, setMapVariant] = useState(() => ReadMapVariant(questDataView));
  const [mandatory, setMandatory] = useState(() => ReadMandatoryFlag(questDataView));

  const onSave = () => {
    let newDV = WriteDeathCount(questDataView, deathCount);
    newDV = WriteQuestFee(newDV, questFee);
    newDV = WriteMandatoryFlag(newDV, mandatory);
    setQuestDataView(newDV);
  }

  return(
    <Panel onSave={() => onSave()}>
        <div className="relative flex items-center mb-8">
          <img src={encartsvg} className="absolute block m-auto -z-10 top-0 left-0 w-80 -translate-x-4" />
          <h1 className=" text-xl font-monsterhunter text-white">Currency Params</h1>
        </div>
        <div className="flex gap-x-3">
            <div className="" ><NumeralInput label="Quest Fee" defaultValue={questFee} onChange={(value) => setQuestFee(parseInt(value))}/></div>
            <div className="" ><NumeralInput label="Death Count" defaultValue={deathCount} onChange={(value) => setDeathCount(parseInt(value))}/></div>
            <div className="" ><NumeralInput label="Map Variant" defaultValue={mapVariant} onChange={(value) => setMapVariant(parseInt(value))}/></div>
            <div className="" ><SelectComponent title="Mandatory Objectives" defaultValue={mandatory} onChange={(value) => setMandatory(parseInt(value))} options={mandatoryDropDownOptions}/></div>
        </div>
    </Panel>
  )
}

export default CurrenciesParams;