import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { MonsterOptions } from '../../Data/monsters'
import { NumeralInput } from '../Form/InputComponent'
import SelectComponent from '../Form/SelectComponent'
import Panel from '../Panel'

export default function MonsterEntry({monsterData, onChange, index}) {

  const [monster, setMonster] = useState(monsterData);

  useEffect(() => {
    if(monster)
      onChange(index, monster)
  }, [monster])

  const editMonsterParam = (paramKey, value) => {
    let newMonster = structuredClone(monster);
    newMonster[paramKey] = value;
    setMonster(newMonster);
  }

  const editMonsterParamPos = (paramKey, value) => {
    let newMonster = structuredClone(monster);
    newMonster.position[paramKey] = value;
    setMonster(newMonster);
  }


  return (
    <div className='flex gap-x-3'>
      <SelectComponent options={MonsterOptions} defaultValue={monster.emid} title="Monster" />
      <NumeralInput label={"Quantity"} defaultValue={monster.qty} />
      <NumeralInput label={"Starting Zone"} defaultValue={monster.zoneId}/>
      <h2>Position</h2>
      <div className="flex">
        <div className="flex-1"><NumeralInput label="X" defaultValue={monster.position.x}/></div>
        <div className="flex-1"><NumeralInput label="Y" defaultValue={monster.position.y}/></div>
        <div className="flex-1"><NumeralInput label="Z" defaultValue={monster.position.z}/></div>
      </div>
    </div>
  )
}
