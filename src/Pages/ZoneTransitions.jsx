import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { PanelTitle } from "../Components/StyledComponents";
import { useQuestData } from "../Hooks/useQuestData";
import {
  ReadZoneTransitions,
  WriteZoneTransitions,
} from "../Utils/ZoneTransitions/zone_transitions_utils";

const EMPTY_TRANSITION = () => ({
  targetStageId: 0,
  stageVariant:  0,
  thisXPos: 0, thisYPos: 0, thisZPos: 0,
  transitionBox: [0, 0, 0, 0, 0],
  targetXPos: 0, targetYPos: 0, targetZPos: 0,
  targetRot0: 0, targetRot1: 0,
});

const ZoneTransitions = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [data, setData] = useImmer(() =>
    ReadZoneTransitions(questDataView)
  );

  const [maxTransitionsPerZone] = useState(() => {
    const initial = ReadZoneTransitions(questDataView);
    const map = {};
    initial.zones.forEach((zone, i) => { map[i] = zone.transitions.length; });
    return map;
  });

  // ── Transitions ──────────────────────────────────────────────────────────────
  const updateTransition = (zoneIdx, tIdx, key, value) => {
    setData((draft) => {
      const t = draft.zones[zoneIdx].transitions[tIdx];
      t[key] = ["targetStageId", "stageVariant", "targetRot0", "targetRot1"].includes(key)
        ? parseInt(value)
        : parseFloat(value);
    });
  };

  const updateTransitionBox = (zoneIdx, tIdx, boxIdx, value) => {
    setData((draft) => {
      draft.zones[zoneIdx].transitions[tIdx].transitionBox[boxIdx] = parseFloat(value);
    });
  };

  const addTransition = (zoneIdx) => {
    setData((draft) => {
      draft.zones[zoneIdx].transitions.push(EMPTY_TRANSITION());
    });
  };

  const removeTransition = (zoneIdx, tIdx) => {
    setData((draft) => {
      draft.zones[zoneIdx].transitions.splice(tIdx, 1);
    });
  };

  // ── Area Mappings ─────────────────────────────────────────────────────────────
  const updateMapping = (idx, key, value) => {
    setData((draft) => {
      draft.mappings[idx][key] = parseFloat(value);
    });
  };

  const onSave = () => {
    const dv = WriteZoneTransitions(questDataView, data);
    setQuestDataView(dv);
  };

  const hasAnyData =
    data.zones.some((z) => z.transitions.length > 0) ||
    data.mappings.length > 0;

  if (!hasAnyData) {
    return (
      <div className="p-4 text-white">
        No zone transition data found in this quest file.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-y-3">

      {/* ── Zone Transitions ── */}
      {data.zones.map((zone, zoneIdx) => {
        const capacity = maxTransitionsPerZone[zoneIdx] ?? 0;
        if (zone.transitions.length === 0 && capacity === 0) return null;
        return (
          <Panel key={`zone-${zoneIdx}`} onSave={onSave}>
            <PanelTitle title={`Zone ${zone.zoneIndex + 1} Transitions`} />
            <div className="flex gap-x-3 items-center mt-2 mb-4">
              {zone.transitions.length < capacity && (
                <button
                  className="transition h-8 px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700"
                  onClick={() => addTransition(zoneIdx)}
                >
                  Add Transition
                </button>
              )}
            </div>
            <div className="flex flex-col gap-y-4">
              {zone.transitions.map((t, tIdx) => (
                <div
                  key={tIdx}
                  className="border border-zinc-600 rounded p-3 flex flex-col gap-y-3"
                >
                  {/* Header row */}
                  <div className="flex flex-wrap gap-x-3 gap-y-2 items-end">
                    <p className="w-full text-orange-400 font-medium text-sm">
                      Transition #{tIdx + 1} → Stage {t.targetStageId}
                    </p>
                    <NumeralInput
                      label="Target Stage ID"
                      defaultValue={t.targetStageId}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "targetStageId", val)}
                    />
                    <NumeralInput
                      label="Stage Variant"
                      defaultValue={t.stageVariant}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "stageVariant", val)}
                    />
                    <button
                      className="h-8 inline-block translate-y-3 transition px-4 py-1 hover:shadow-md bg-zinc-500 shadow-sm rounded text-white hover:bg-red-600 active:bg-red-700"
                      onClick={() => removeTransition(zoneIdx, tIdx)}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Source position */}
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                    Trigger Position (this area)
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 items-end">
                    <NumeralInput label="X" defaultValue={t.thisXPos}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "thisXPos", val)} />
                    <NumeralInput label="Y" defaultValue={t.thisYPos}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "thisYPos", val)} />
                    <NumeralInput label="Z" defaultValue={t.thisZPos}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "thisZPos", val)} />
                  </div>

                  {/* Bounding box */}
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                    Transition Bounding Box
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 items-end">
                    {t.transitionBox.map((val, boxIdx) => (
                      <NumeralInput
                        key={boxIdx}
                        label={`Box ${boxIdx}`}
                        defaultValue={val}
                        onChange={(v) => updateTransitionBox(zoneIdx, tIdx, boxIdx, v)}
                      />
                    ))}
                  </div>

                  {/* Target position + rotation */}
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                    Spawn Position (target area)
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 items-end">
                    <NumeralInput label="X" defaultValue={t.targetXPos}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "targetXPos", val)} />
                    <NumeralInput label="Y" defaultValue={t.targetYPos}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "targetYPos", val)} />
                    <NumeralInput label="Z" defaultValue={t.targetZPos}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "targetZPos", val)} />
                    <NumeralInput label="Rotation 0" defaultValue={t.targetRot0}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "targetRot0", val)} />
                    <NumeralInput label="Rotation 1" defaultValue={t.targetRot1}
                      onChange={(val) => updateTransition(zoneIdx, tIdx, "targetRot1", val)} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        );
      })}

      {/* ── Area Mappings ── */}
      {data.mappings.length > 0 && (
        <Panel onSave={onSave}>
          <PanelTitle title="Area Mappings" />
          <div className="flex flex-col gap-y-4 mt-4">
            {data.mappings.map((mapping, idx) => (
              <div
                key={idx}
                className="border border-zinc-600 rounded p-3 flex flex-wrap gap-x-3 gap-y-2 items-end"
              >
                <p className="w-full text-cyan-400 font-medium text-sm">
                  Mapping #{idx + 1}
                </p>
                <NumeralInput label="Area X" defaultValue={mapping.areaXPos}
                  onChange={(val) => updateMapping(idx, "areaXPos", val)} />
                <NumeralInput label="Area Z" defaultValue={mapping.areaZPos}
                  onChange={(val) => updateMapping(idx, "areaZPos", val)} />
                <NumeralInput label="Base X" defaultValue={mapping.baseXPos}
                  onChange={(val) => updateMapping(idx, "baseXPos", val)} />
                <NumeralInput label="Base Z" defaultValue={mapping.baseZPos}
                  onChange={(val) => updateMapping(idx, "baseZPos", val)} />
                <NumeralInput label="kn Pos" defaultValue={mapping.knPos}
                  onChange={(val) => updateMapping(idx, "knPos", val)} />
              </div>
            ))}
          </div>
        </Panel>
      )}

    </div>
  );
};

export default ZoneTransitions;
