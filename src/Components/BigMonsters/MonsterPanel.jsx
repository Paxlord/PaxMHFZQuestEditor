import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { MonsterOptions } from '../../Data/monsters'
import { NumeralInput } from '../Form/InputComponent'
import SelectComponent from '../Form/SelectComponent'
import Panel from '../Panel'

export default function MonsterEntry({monsterData, updateMonsters, updateMonsterPos, deleteMonster, index}) {

  return (
    <div className='flex gap-x-3 flex-wrap items-center my-8 '>
      <SelectComponent options={MonsterOptions} defaultValue={monsterData.emid} title="Monster" onChange={(value) => updateMonsters("emid", index, value)}/>
      <NumeralInput label={"Quantity"} defaultValue={monsterData.qty} onChange={(value) => updateMonsters("qty", index, value)} />
      <NumeralInput label={"Starting Zone"} defaultValue={monsterData.zoneId} onChange={(value) => updateMonsters("zoneId", index, value)}/>
      <p>{monsterData.locationId}</p>
      <button onClick={() => deleteMonster(index)} className="transition px-4 py-1 hover:shadow-md bg-violet-400 shadow-sm rounded text-white hover:bg-violet-500 active:bg-violet-600">delete this monster</button>
      <div className="flex gap-x-3">
        <div className="flex-1"><NumeralInput label="X" defaultValue={monsterData.position.x} onChange={(value) => updateMonsterPos("x", index, value)}/></div>
        <div className="flex-1"><NumeralInput label="Y" defaultValue={monsterData.position.y} onChange={(value) => updateMonsterPos("y", index, value)}/></div>
        <div className="flex-1"><NumeralInput label="Z" defaultValue={monsterData.position.z} onChange={(value) => updateMonsterPos("z", index, value)}/></div>
      </div>
    </div>
  )
}
