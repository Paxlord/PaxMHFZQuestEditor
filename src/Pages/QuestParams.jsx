import CurrenciesParams from "../Components/QuestParams/CurrenciesParams";
import MonstersParams from "../Components/QuestParams/MonstersParams";
import ObjectiveParams from "../Components/QuestParams/ObjectiveParams";

const QuestParams = () => {

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <ObjectiveParams />
      <CurrenciesParams />
      <MonstersParams />
    </div>
  )
}

export default QuestParams;