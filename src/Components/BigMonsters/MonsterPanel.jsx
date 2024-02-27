import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MonsterOptions } from "../../Data/monsters";
import { NumeralInput } from "../Form/InputComponent";
import SelectComponent from "../Form/SelectComponent";
import Panel from "../Panel";
import { GenerateAreaOptions } from "../../Data/areas";
import coord_data from "../../Data/most_common_coord.json";

export default function MonsterEntry({
  monsterData,
  updateMonsters,
  updateMonsterPos,
  deleteMonster,
  index,
  mapLocale,
}) {
  const areaOptions = GenerateAreaOptions(mapLocale);

  const updateAreaCoords = (value) => {
    updateMonsters("zoneId", index, value);

    if (coord_data[mapLocale][value]) {
      let { x, y, z } = coord_data[mapLocale][value];
      console.log(x, y, z);
      updateMonsterPos("x", index, x);
      updateMonsterPos("y", index, y);
      updateMonsterPos("z", index, z);
    }
  };

  return (
    <div className="flex justify-between items-center my-8 ">
      <div className="flex gap-x-3">
        <SelectComponent
          options={MonsterOptions}
          defaultValue={monsterData.emid}
          title="Monster"
          onChange={(value) => updateMonsters("emid", index, value)}
        />
        <NumeralInput
          label={"Quantity"}
          size="sm"
          defaultValue={monsterData.qty}
          onChange={(value) => updateMonsters("qty", index, value)}
        />
        {areaOptions ? (
          <SelectComponent
            options={areaOptions}
            defaultValue={monsterData.zoneId}
            title={"Starting Zone"}
            onChange={(value) => updateAreaCoords(value)}
          />
        ) : (
          <NumeralInput
            label={"Starting Zone"}
            defaultValue={monsterData.zoneId}
            onChange={(value) => updateMonsters("zoneId", index, value)}
          />
        )}
      </div>
      <div className="flex gap-x-3">
        <div className="flex-1">
          <NumeralInput
            label="X"
            size={"xs"}
            defaultValue={monsterData.position.x}
            onChange={(value) => updateMonsterPos("x", index, value)}
          />
        </div>
        <div className="flex-1">
          <NumeralInput
            label="Y"
            size={"xs"}
            defaultValue={monsterData.position.y}
            onChange={(value) => updateMonsterPos("y", index, value)}
          />
        </div>
        <div className="flex-1">
          <NumeralInput
            label="Z"
            size={"xs"}
            defaultValue={monsterData.position.z}
            onChange={(value) => updateMonsterPos("z", index, value)}
          />
        </div>
      </div>
      <button
        onClick={() => deleteMonster(index)}
        className="h-10 inline-block translate-y-3 transition px-4 py-1 hover:shadow-md bg-zinc-500 shadow-sm rounded text-white hover:bg-red-600 active:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}
