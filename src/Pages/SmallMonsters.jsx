import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../Components/Form/InputComponent";
import SelectComponent from "../Components/Form/SelectComponent";
import Panel from "../Components/Panel";
import { PanelTitle } from "../Components/StyledComponents";
import { Monsters, MonsterOptions } from "../Data/monsters";
import { useQuestData } from "../Hooks/useQuestData";
import {
  ReadAllSmallMonsters,
  WriteAllSmallMonsters,
} from "../Utils/SmallMonsters/small_monsters_utils";

const EMPTY_SPAWN = () => ({
  monsterId: 0,
  spawnToggle: 0,
  spawnAmount: 1,
  unk0: 0,
  unk1: 0,
  position: { x: 0, y: 0, z: 0 },
});

const SmallMonsters = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [mapGroups, setMapGroups] = useImmer(() =>
    ReadAllSmallMonsters(questDataView)
  );

  // Track original spawn count per section as max capacity
  const [maxSpawns] = useState(() => {
    const initial = ReadAllSmallMonsters(questDataView);
    const map = {};
    initial.forEach((group, gi) => {
      group.sections.forEach((section, si) => {
        map[`${gi}-${si}`] = section.smallMonsters.length;
      });
    });
    return map;
  });

  const updateSpawn = (groupIdx, sectionIdx, spawnIdx, key, value) => {
    setMapGroups((draft) => {
      if (key === "x" || key === "y" || key === "z") {
        draft[groupIdx].sections[sectionIdx].smallMonsters[spawnIdx].position[
          key
        ] = parseFloat(value);
      } else {
        draft[groupIdx].sections[sectionIdx].smallMonsters[spawnIdx][key] =
          parseInt(value);
      }
    });
  };

  const addSpawn = (groupIdx, sectionIdx) => {
    setMapGroups((draft) => {
      draft[groupIdx].sections[sectionIdx].smallMonsters.push(EMPTY_SPAWN());
    });
  };

  const removeSpawn = (groupIdx, sectionIdx, spawnIdx) => {
    setMapGroups((draft) => {
      draft[groupIdx].sections[sectionIdx].smallMonsters.splice(spawnIdx, 1);
    });
  };

  const onSave = () => {
    let dv = WriteAllSmallMonsters(questDataView, mapGroups);
    setQuestDataView(dv);
  };

  if (mapGroups.length === 0) {
    return (
      <div className="p-4 text-white">
        No small monster data found in this quest file.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-y-3">
      {mapGroups.map((group, groupIdx) =>
        group.sections.map((section, sectionIdx) => {
          const key = `${groupIdx}-${sectionIdx}`;
          const capacity = maxSpawns[key] ?? 0;
          if (capacity === 0) return null;
          const currentCount = section.smallMonsters.length;
          return (
            <Panel key={key} onSave={() => onSave()}>
              <PanelTitle title="Small Monsters parameter" />
              <div className="flex flex-col gap-y-4 mt-4">
                {section.smallMonsters.map((spawn, spawnIdx) => (
                  <div
                    key={spawnIdx}
                    className="border border-zinc-600 rounded p-3 flex flex-wrap gap-x-3 gap-y-2 items-end"
                  >
                    <div className="w-full flex items-center justify-between">
                      <p className="text-green-400 font-medium text-sm">
                        Spawn #{spawnIdx + 1} —{" "}
                        {Monsters[spawn.monsterId] ?? `ID ${spawn.monsterId}`}
                      </p>
                      <button
                        onClick={() => removeSpawn(groupIdx, sectionIdx, spawnIdx)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400 hover:border-red-300 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                    <SelectComponent
                      title="Monster"
                      defaultValue={spawn.monsterId}
                      options={MonsterOptions}
                      onChange={(val) =>
                        updateSpawn(groupIdx, sectionIdx, spawnIdx, "monsterId", val)
                      }
                    />
                    <NumeralInput
                      label="Spawn Amount"
                      defaultValue={spawn.spawnAmount}
                      onChange={(val) =>
                        updateSpawn(groupIdx, sectionIdx, spawnIdx, "spawnAmount", val)
                      }
                    />
                    <NumeralInput
                      label="Spawn Toggle"
                      defaultValue={spawn.spawnToggle}
                      onChange={(val) =>
                        updateSpawn(groupIdx, sectionIdx, spawnIdx, "spawnToggle", val)
                      }
                    />
                    <NumeralInput
                      label="X Position"
                      defaultValue={spawn.position.x}
                      onChange={(val) =>
                        updateSpawn(groupIdx, sectionIdx, spawnIdx, "x", val)
                      }
                    />
                    <NumeralInput
                      label="Y Position"
                      defaultValue={spawn.position.y}
                      onChange={(val) =>
                        updateSpawn(groupIdx, sectionIdx, spawnIdx, "y", val)
                      }
                    />
                    <NumeralInput
                      label="Z Position"
                      defaultValue={spawn.position.z}
                      onChange={(val) =>
                        updateSpawn(groupIdx, sectionIdx, spawnIdx, "z", val)
                      }
                    />
                  </div>
                ))}
                {currentCount < capacity && (
                  <button
                    onClick={() => addSpawn(groupIdx, sectionIdx)}
                    className="self-start text-green-400 hover:text-green-300 text-xs px-3 py-1 border border-green-400 hover:border-green-300 rounded transition"
                  >
                    + Add Spawn
                  </button>
                )}
              </div>
            </Panel>
          );
        })
      )}
    </div>
  );
};

export default SmallMonsters;
