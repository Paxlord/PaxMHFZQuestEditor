import { useQuestData } from "../Hooks/useQuestData";
import { useImmer } from 'use-immer';
import { ReadEquipmentRestrictions, WriteEquipments } from "../Utils/QuestParams/equipment_utils";
import { NumeralInput } from "../Components/Form/InputComponent";

import Panel from '../Components/Panel';

const EquipmentRestriction = () => {

  const { questDataView, setQuestDataView } = useQuestData();
  const [equipments, setEquipments] = useImmer(() => ReadEquipmentRestrictions(questDataView));

  const updateEquipments = (equipKey, key, value) => {
    setEquipments(draft => {
      let curPieceId = draft[equipKey][key].piece_id;
      
      if(key === "piece_id" && parseInt(value) !== 0){
        draft[equipKey].deco_1 = 32768;
        draft[equipKey].deco_2 = 32768;
        draft[equipKey].deco_3 = 32768;
      }
      
      if(key === "piece_id" && parseInt(value) === 0){
        draft[equipKey].deco_1 = 0;
        draft[equipKey].deco_2 = 0;
        draft[equipKey].deco_3 = 0;
      }
      
      draft[equipKey][key] = parseInt(value);
    })
  }

  const onSave = () => {
    let dv = WriteEquipments(questDataView, equipments);
    setQuestDataView(dv);
  }

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <Panel onSave={() => onSave()}>
        <h1>Restricted Equipment</h1>
        {
          Object.keys(equipments).map((key) => {

            if(key.includes("unk")){
              return null
            }

            return(
              <div className="my-3" >
                <h1 className="text-lg capitalize text-white my-3">{key}</h1>
                <div className="flex gap-x-3">
                  <NumeralInput label={"Piece ID"} defaultValue={equipments[key].piece_id} onChange={(value) => updateEquipments(key, "piece_id", value)} />
                  <NumeralInput label={"Deco 1"} defaultValue={equipments[key].deco_1} onChange={(value) => updateEquipments(key, "deco_1", value)} />
                  <NumeralInput label={"Deco 2"} defaultValue={equipments[key].deco_2} onChange={(value) => updateEquipments(key, "deco_2", value)} />
                  <NumeralInput label={"Deco 3"} defaultValue={equipments[key].deco_3} onChange={(value) => updateEquipments(key, "deco_3", value)} />
                </div>
              </div>
            )
          })
        }
      </Panel>
    </div>
  )
}

export default EquipmentRestriction;