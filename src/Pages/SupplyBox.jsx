import { useImmer } from "use-immer";
import { NumeralInput } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { PanelTitle } from "../Components/StyledComponents";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadSupplyBox, WriteSupplyBox } from "../Utils/QuestParams/supply_box_utils";
import { Items } from "../Data/items";

const SupplyBox = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [supplyBox, setSupplyBox] = useImmer(() => ReadSupplyBox(questDataView));

  const updateItem = (section, idx, key, value) => {
    setSupplyBox((draft) => {
      draft[section][idx][key] = parseInt(value);
    });
  };

  const onSave = () => {
    const dv = WriteSupplyBox(questDataView, supplyBox);
    setQuestDataView(dv);
  };

  if (!supplyBox) {
    return (
      <div className="p-4 text-white">
        No supply box data found in this quest file.
      </div>
    );
  }

  const renderSection = (title, section, items) => (
    <Panel onSave={onSave}>
      <PanelTitle title={title} />
      <div className="flex flex-col gap-y-3 my-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-evenly items-center">
            <NumeralInput
              label="Item ID"
              defaultValue={item.itemId}
              onChange={(val) => updateItem(section, idx, "itemId", val)}
            />
            <p className="w-36 translate-y-3 text-white">
              {item.itemId > 0 && item.itemId <= Items.length
                ? Items[item.itemId]
                : ""}
            </p>
            <NumeralInput
              label="Quantity"
              defaultValue={item.quantity}
              onChange={(val) => updateItem(section, idx, "quantity", val)}
            />
          </div>
        ))}
      </div>
    </Panel>
  );

  return (
    <div className="p-4 flex flex-col gap-y-3">
      {renderSection("Main Supply Box", "main", supplyBox.main)}
      {renderSection("Sub A Supply Box", "subA", supplyBox.subA)}
      {renderSection("Sub B Supply Box", "subB", supplyBox.subB)}
    </div>
  );
};

export default SupplyBox;
