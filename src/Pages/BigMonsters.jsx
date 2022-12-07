import { useState } from "react";
import MonsterPanel from "../Components/BigMonsters/MonsterPanel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadMonsterArray } from "../Utils/BigMonsters/monster_utils";

const BigMonsters = () => {

  const { questDataView } = useQuestData();

  const [monsters, setMonsters] = useState(ReadMonsterArray(questDataView));


  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      {monsters && monsters.map((monster) => {
        if(monster)
          return <MonsterPanel monsterData={monster} />
      })}
    </div>
  )
}

export default BigMonsters;