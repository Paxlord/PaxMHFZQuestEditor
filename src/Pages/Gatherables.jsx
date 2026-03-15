import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { PanelTitle } from "../Components/StyledComponents";
import { useQuestData } from "../Hooks/useQuestData";
import {
  ReadGatheringPoints,
  WriteGatheringPoints,
} from "../Utils/Gatherables/gathering_utils";
import {
  ReadAreaFacilities,
  WriteAreaFacilities,
} from "../Utils/Gatherables/facilities_utils";
import {
  ReadGatheringTables,
  WriteGatheringTables,
} from "../Utils/Gatherables/gathering_tables_utils";
import { Items } from "../Data/items";

const EMPTY_POINT = () => ({
  xPos: 0,
  yPos: 0,
  zPos: 0,
  scope: 0,
  gatheringID: 0,
  maxCount: 1,
  unk: 0,
  minCount: 1,
});

const EMPTY_FAC = () => ({
  type: 0,
  xPos: 0,
  yPos: 0,
  zPos: 0,
  range: 0,
  kn4: 0,
});

const EMPTY_ITEM = () => ({
  rate: 0,
  itemId: 0,
});

const Gatherables = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [zones, setZones] = useImmer(() =>
    ReadGatheringPoints(questDataView)
  );
  const [facZones, setFacZones] = useImmer(() =>
    ReadAreaFacilities(questDataView)
  );
  const [tables, setTables] = useImmer(() =>
    ReadGatheringTables(questDataView)
  );

  const [maxPointsPerZone] = useState(() => {
    const initial = ReadGatheringPoints(questDataView);
    const map = {};
    initial.forEach((zone, i) => { map[i] = zone.points.length; });
    return map;
  });

  const [maxFacsPerZone] = useState(() => {
    const initial = ReadAreaFacilities(questDataView);
    const map = {};
    initial.forEach((zone, i) => { map[i] = zone.points.length; });
    return map;
  });

  const [maxItemsPerTable] = useState(() => {
    const initial = ReadGatheringTables(questDataView);
    const map = {};
    initial.forEach((table, i) => { map[i] = table.items.length; });
    return map;
  });

  // --- Gathering points ---
  const updatePoint = (zoneIdx, pointIdx, key, value) => {
    setZones((draft) => {
      draft[zoneIdx].points[pointIdx][key] =
        key === "xPos" || key === "yPos" || key === "zPos" || key === "scope"
          ? parseFloat(value)
          : parseInt(value);
    });
  };
  const addPoint = (zoneIdx) => {
    setZones((draft) => { draft[zoneIdx].points.push(EMPTY_POINT()); });
  };
  const removePoint = (zoneIdx, pointIdx) => {
    setZones((draft) => { draft[zoneIdx].points.splice(pointIdx, 1); });
  };

  // --- Facilities ---
  const updateFac = (zoneIdx, facIdx, key, value) => {
    setFacZones((draft) => {
      draft[zoneIdx].points[facIdx][key] =
        key === "xPos" || key === "yPos" || key === "zPos" || key === "range"
          ? parseFloat(value)
          : parseInt(value);
    });
  };
  const addFac = (zoneIdx) => {
    setFacZones((draft) => { draft[zoneIdx].points.push(EMPTY_FAC()); });
  };
  const removeFac = (zoneIdx, facIdx) => {
    setFacZones((draft) => { draft[zoneIdx].points.splice(facIdx, 1); });
  };

  // --- Gathering tables ---
  const updateItem = (tableIdx, itemIdx, key, value) => {
    setTables((draft) => {
      draft[tableIdx].items[itemIdx][key] = parseInt(value);
    });
  };
  const addItem = (tableIdx) => {
    setTables((draft) => { draft[tableIdx].items.push(EMPTY_ITEM()); });
  };
  const removeItem = (tableIdx, itemIdx) => {
    setTables((draft) => { draft[tableIdx].items.splice(itemIdx, 1); });
  };

  const onSave = () => {
    let dv = WriteGatheringPoints(questDataView, zones);
    dv = WriteAreaFacilities(dv, facZones);
    dv = WriteGatheringTables(dv, tables);
    setQuestDataView(dv);
  };

  const hasAnyData =
    zones.some((z) => z.points.length > 0) ||
    facZones.some((z) => z.points.length > 0) ||
    tables.some((t) => t.items.length > 0);

  if (!hasAnyData) {
    return (
      <div className="p-4 text-white">
        No gathering data found in this quest file.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-y-3">

      {/* ── Gathering Points ── */}
      {zones.map((zone, zoneIdx) => {
        const capacity = maxPointsPerZone[zoneIdx] ?? 0;
        if (zone.points.length === 0 && capacity === 0) return null;
        return (
          <Panel key={`gather-${zoneIdx}`} onSave={onSave}>
            <PanelTitle title={`Zone ${zone.zoneIndex + 1} Gathering Points`} />
            <div className="flex flex-col gap-y-4 mt-4">
              {zone.points.map((point, pointIdx) => (
                <div
                  key={pointIdx}
                  className="border border-zinc-600 rounded p-3 flex flex-wrap gap-x-3 gap-y-2 items-end"
                >
                  <p className="w-full text-green-400 font-medium text-sm">
                    Point #{pointIdx + 1} — Gathering Table ID: {point.gatheringID}
                  </p>
                  <NumeralInput
                    label="Gathering Table ID"
                    defaultValue={point.gatheringID}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "gatheringID", val)}
                  />
                  <NumeralInput
                    label="Min Count"
                    defaultValue={point.minCount}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "minCount", val)}
                  />
                  <NumeralInput
                    label="Max Count"
                    defaultValue={point.maxCount}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "maxCount", val)}
                  />
                  <NumeralInput
                    label="Scope (Radius)"
                    defaultValue={point.scope}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "scope", val)}
                  />
                  <NumeralInput
                    label="X Position"
                    defaultValue={point.xPos}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "xPos", val)}
                  />
                  <NumeralInput
                    label="Y Position"
                    defaultValue={point.yPos}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "yPos", val)}
                  />
                  <NumeralInput
                    label="Z Position"
                    defaultValue={point.zPos}
                    onChange={(val) => updatePoint(zoneIdx, pointIdx, "zPos", val)}
                  />
                  <button
                    className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded"
                    onClick={() => removePoint(zoneIdx, pointIdx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {zone.points.length < capacity && (
                <button
                  className="self-start px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded"
                  onClick={() => addPoint(zoneIdx)}
                >
                  + Add Point
                </button>
              )}
            </div>
          </Panel>
        );
      })}

      {/* ── Facilities ── */}
      {facZones.map((zone, zoneIdx) => {
        const capacity = maxFacsPerZone[zoneIdx] ?? 0;
        if (zone.points.length === 0 && capacity === 0) return null;
        return (
          <Panel key={`fac-${zoneIdx}`} onSave={onSave}>
            <PanelTitle title={`Zone ${zone.zoneIndex + 1} Facilities`} />
            <div className="flex flex-col gap-y-4 mt-4">
              {zone.points.map((fac, facIdx) => (
                <div
                  key={facIdx}
                  className="border border-zinc-600 rounded p-3 flex flex-wrap gap-x-3 gap-y-2 items-end"
                >
                  <p className="w-full text-blue-400 font-medium text-sm">
                    Facility #{facIdx + 1} — Type: {fac.type}
                  </p>
                  <NumeralInput
                    label="Type"
                    defaultValue={fac.type}
                    onChange={(val) => updateFac(zoneIdx, facIdx, "type", val)}
                  />
                  <NumeralInput
                    label="X Position"
                    defaultValue={fac.xPos}
                    onChange={(val) => updateFac(zoneIdx, facIdx, "xPos", val)}
                  />
                  <NumeralInput
                    label="Y Position"
                    defaultValue={fac.yPos}
                    onChange={(val) => updateFac(zoneIdx, facIdx, "yPos", val)}
                  />
                  <NumeralInput
                    label="Z Position"
                    defaultValue={fac.zPos}
                    onChange={(val) => updateFac(zoneIdx, facIdx, "zPos", val)}
                  />
                  <NumeralInput
                    label="Range"
                    defaultValue={fac.range}
                    onChange={(val) => updateFac(zoneIdx, facIdx, "range", val)}
                  />
                  <NumeralInput
                    label="kn4"
                    defaultValue={fac.kn4}
                    onChange={(val) => updateFac(zoneIdx, facIdx, "kn4", val)}
                  />
                  <button
                    className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded"
                    onClick={() => removeFac(zoneIdx, facIdx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {zone.points.length < capacity && (
                <button
                  className="self-start px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded"
                  onClick={() => addFac(zoneIdx)}
                >
                  + Add Facility
                </button>
              )}
            </div>
          </Panel>
        );
      })}

      {/* ── Gathering Tables (drop items + rates) ── */}
      {tables.map((table, tableIdx) => {
        const capacity = maxItemsPerTable[tableIdx] ?? 0;
        if (table.items.length === 0 && capacity === 0) return null;
        const totalRate = table.items.reduce((sum, item) => sum + item.rate, 0);
        const rateColor =
          totalRate === 100
            ? "text-green-400"
            : totalRate > 100
            ? "text-red-400"
            : "text-yellow-400";
        const rateLabel =
          totalRate > 100
            ? `⚠ Total Rate ${totalRate}% — exceeds 100%!`
            : totalRate === 100
            ? `Total Rate 100% ✓`
            : `Total Rate ${totalRate}%`;
        return (
          <Panel key={`table-${tableIdx}`} onSave={onSave}>
            <PanelTitle title={`Gathering Table #${table.tableIndex} (ID ${table.tableIndex})`} />
            <div className="flex gap-x-3 items-center">
              <button
                className="transition h-8 px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700"
                onClick={() => addItem(tableIdx)}
              >
                Add a new Item
              </button>
              <p className={`text-lg ${rateColor} font-medium`}>
                {rateLabel}
              </p>
            </div>
            <div className="flex flex-col gap-y-3 my-6">
              {table.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex justify-evenly items-center">
                  <NumeralInput
                    label="Item ID"
                    defaultValue={item.itemId}
                    onChange={(val) => updateItem(tableIdx, itemIdx, "itemId", val)}
                  />
                  <p className="w-36 translate-y-3 text-white">
                    {item.itemId > 0 && item.itemId <= Items.length
                      ? Items[item.itemId]
                      : ""}
                  </p>
                  <NumeralInput
                    label="Rate (%)"
                    defaultValue={item.rate}
                    onChange={(val) => updateItem(tableIdx, itemIdx, "rate", val)}
                  />
                  <button
                    className="h-8 inline-block translate-y-3 transition px-4 py-1 hover:shadow-md bg-zinc-500 shadow-sm rounded text-white hover:bg-red-600 active:bg-red-700"
                    onClick={() => removeItem(tableIdx, itemIdx)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        );
      })}

    </div>
  );
};

export default Gatherables;
