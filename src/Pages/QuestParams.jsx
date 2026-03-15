import CurrenciesParams from "../Components/QuestParams/CurrenciesParams";
import MapParams from "../Components/QuestParams/MapParams";
import MonstersParams from "../Components/QuestParams/MonstersParams";
import ObjectiveParams from "../Components/QuestParams/ObjectiveParams";
import QuestFlags from "../Components/QuestParams/QuestsFlags";

const QuestParams = () => {
  return (
    <div className="p-4 flex flex-col gap-y-3 ">
      <ObjectiveParams />
      <CurrenciesParams />
      <MapParams />
      <QuestFlags />
    </div>
  );
};

export default QuestParams;
