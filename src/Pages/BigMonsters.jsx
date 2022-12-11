import { useState } from "react";
import MonsterEntry from "../Components/BigMonsters/MonsterPanel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadMonsterArray } from "../Utils/BigMonsters/monster_utils";
import MonstersParams from "../Components/QuestParams/MonstersParams";
import Panel from "../Components/Panel";

const BigMonsters = () => {

  const { questDataView } = useQuestData();

  const [monsters, setMonsters] = useState(ReadMonsterArray(questDataView));

  const changeMonsterParams = (idx, monsterObj) => {
    let newMonsters = monsters.map((monster, i) => {
      if(idx === i){
        return structuredClone(monsterObj)
      }

      return monster
    })

    setMonsters(newMonsters);
  }


  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      <MonstersParams />
      <Panel>
        {monsters && monsters.map((monster, idx) => {
          if(monster)
            return <MonsterEntry monsterData={monster} onChange={changeMonsterParams} index={idx} />
        })}
      </Panel>
    </div>
  )
}

export default BigMonsters;