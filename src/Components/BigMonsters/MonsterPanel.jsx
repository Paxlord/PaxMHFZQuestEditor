import React from 'react'
import { MonsterOptions } from '../../Data/monsters'
import { NumeralInput } from '../Form/InputComponent'
import SelectComponent from '../Form/SelectComponent'
import Panel from '../Panel'

export default function MonsterPanel({monsterData}) {
  return (
    <Panel>
      <SelectComponent options={MonsterOptions} defaultValue={monsterData.emid} title="Monster" />
      <NumeralInput label={"Quantity"} defaultValue={monsterData.qty} />
      <NumeralInput label={"Starting Zone"} defaultValue={monsterData.zoneId}/>
      <h2>Position</h2>
      <div className="flex">
        <div className="flex-1"><NumeralInput label="X" defaultValue={monsterData.position.x}/></div>
        <div className="flex-1"><NumeralInput label="Y" defaultValue={monsterData.position.y}/></div>
        <div className="flex-1"><NumeralInput label="Z" defaultValue={monsterData.position.z}/></div>
      </div>
    </Panel>
  )
}
