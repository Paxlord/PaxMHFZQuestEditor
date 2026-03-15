import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../Form/InputComponent";
import SelectComponent from "../Form/SelectComponent";
import Panel from "../Panel";
import { PanelTitle } from "../StyledComponents";
import { useQuestData } from "../../Hooks/useQuestData";
import {
  ReadQuestLocale,
  WriteQuestMap,
  ReadMapInfo,
  WriteMapInfo,
} from "../../Utils/QuestParams/misc_utils";
import { MapOptions } from "../../Data/maps";
import { BCMapOptions } from "../../Data/bcMaps";

const MapParams = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [questMap, setQuestMap] = useState(() =>
    ReadQuestLocale(questDataView)
  );
  const [mapInfo, setMapInfo] = useImmer(() => ReadMapInfo(questDataView));

  const onSave = () => {
    let dv = WriteQuestMap(questDataView, questMap);
    dv = WriteMapInfo(dv, mapInfo);
    setQuestDataView(dv);
  };

  return (
    <Panel onSave={() => onSave()}>
      <PanelTitle title="Map Settings" />
      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4">
        <SelectComponent
          title="Quest Map"
          defaultValue={questMap}
          options={MapOptions}
          onChange={(val) => setQuestMap(parseInt(val))}
        />
        {mapInfo && (
          <>
            <NumeralInput
              label="Map ID (Loaded)"
              defaultValue={mapInfo.mapID}
              onChange={(val) =>
                setMapInfo((draft) => {
                  draft.mapID = parseInt(val);
                })
              }
            />
            <SelectComponent
              title="Return BC"
              defaultValue={mapInfo.returnBC_ID}
              options={BCMapOptions}
              onChange={(val) =>
                setMapInfo((draft) => {
                  draft.returnBC_ID = parseInt(val);
                })
              }
            />
          </>
        )}
      </div>
    </Panel>
  );
};

export default MapParams;
