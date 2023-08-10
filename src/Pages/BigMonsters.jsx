import { useState } from "react";
import MonsterEntry from "../Components/BigMonsters/MonsterPanel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadMonsterArray, WriteMonsters } from "../Utils/BigMonsters/monster_utils";
import MonstersParams from "../Components/QuestParams/MonstersParams";
import Panel from "../Components/Panel";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import VariantsPanel from "../Components/BigMonsters/VariantsPanel";
import { PanelTitle } from "../Components/StyledComponents";

const BigMonsters = () => {

  const { questDataView, setQuestDataView } = useQuestData();

  const [monsters, setMonsters] = useImmer(() => ReadMonsterArray(questDataView));

  const updateMonsters = (key, idx, value) => {
    setMonsters(draft => {
      draft[idx][key] = parseInt(value)
    })
  }

  const updateMonsterPos = (key, idx, value) => {
    setMonsters(draft => {
      draft[idx].position[key] = parseFloat(value)
    })
  }

  const addNewMonster = () => {

    let firstEmptySlot = -1;
    monsters.every((monster, idx) => {
      if(monster == null){
        firstEmptySlot = idx;
        return false;
      }

      return true;
    })

    if(firstEmptySlot === -1){
      console.error("Array full(max monster is 5), remove a monster before proceeding");
      return;
    }

    setMonsters(draft => {
      draft[firstEmptySlot] = {
        emid: 0,
        qty: 1,
        zoneId: 0,
        position: {
          x: 0,
          y: 0,
          z: 0,
        }
      }
    })
  }

  const deleteMonster = (idx) => {
    setMonsters(draft => {
      draft.splice(idx, 1);
      draft.push(null);
    })
  }

  useEffect(() => {
    if(monsters){
      console.log("Monster Changed", monsters);
    }
  }, [monsters])

  const Save = () => {
    let dv = WriteMonsters(questDataView, monsters);
    setQuestDataView(dv);
  }

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <MonstersParams />
      <VariantsPanel />
      <Panel onSave={() => Save()}>
        <PanelTitle title="Monsters List"/>
        <button onClick={() => addNewMonster()} className="transition px-4 py-1 hover:shadow-md bg-violet-400 shadow-sm rounded text-white hover:bg-violet-500 active:bg-violet-600">Add a monster</button>
        {monsters && monsters.map((monster, idx) => {
          if(monster)
            return <MonsterEntry monsterData={monster} 
                                 updateMonsters={updateMonsters} 
                                 updateMonsterPos={updateMonsterPos} 
                                 index={idx}
                                 deleteMonster={deleteMonster} />
        })}
      </Panel>
    </div>
  )
}

export default BigMonsters;