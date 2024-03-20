import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import {
  ReadMandatoryFlag,
  ReadQuestFileId,
  ReadQuestRestrictions,
  ReadRankRestrictions,
  ReadRewardMats,
  ReadStars,
  ReadTimeLimit,
  WriteQuestFileId,
  WriteQuestRequirements,
  WriteRankRestriction,
  WriteRewardMats,
  WriteStars,
  WriteTimeLimit,
} from "../Utils/QuestParams/misc_utils";
import { save } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { QuestToQuestList } from "../Utils/QuestParams/questlist_utils";
import SelectComponent from "../Components/Form/SelectComponent";
import { CountersOptions } from "../Data/counters";
import { BasicButton, PanelTitle } from "../Components/StyledComponents";
import { Items } from "../Data/items";
import { GenerateRequirementsOptions } from "../Data/requirements";

const event_day_options = [
  {
    value: 1,
    label: "Night",
  },
  {
    value: 0,
    label: "Day",
  },
  {
    value: -1,
    label: "Any",
  },
];

const season_options = [
  {
    value: 0,
    label: "Breeding",
  },
  {
    value: 1,
    label: "Warm",
  },
  {
    value: 2,
    label: "Cold",
  },
  {
    value: -1,
    label: "Any",
  },
];

const appeal_options = [
  {
    value: 0,
    label: "None",
  },
  {
    value: 1,
    label: "Recommanded",
  },
  {
    value: 2,
    label: "New",
  },
];

const ArrayToBitFlag = (array) => {
  let byte = 0;
  array.forEach((bit) => (byte = (byte << 1) + bit));
  return byte;
};

const requirements_options = GenerateRequirementsOptions();

const MiscParams = () => {
  const { questDataView, setQuestDataView } = useQuestData();

  const [timeLimit, setTimeLimit] = useState(
    () => ReadTimeLimit(questDataView) / 1800
  );
  const [questFileId, setQuestFileId] = useState(() =>
    ReadQuestFileId(questDataView)
  );
  const [rankRestriction, setRankRestrictions] = useImmer(() =>
    ReadRankRestrictions(questDataView)
  );
  const [rewardMats, setRewardMats] = useImmer(() =>
    ReadRewardMats(questDataView)
  );

  const [questRequirements, setQuestRequirements] = useState(() =>
    ReadQuestRestrictions(questDataView)
  );

  const [stars, setStars] = useState(() => ReadStars(questDataView));

  const [dayIndex, setDayIndex] = useState(-1);
  const [seasonIndex, setSeasonIndex] = useState(-1);

  const [maxPlayers, setMaxPlayers] = useState(4);
  const [counterId, setCounterId] = useState(26);
  const [appealMark, setAppealMark] = useState(0);

  const updateRankRestrictions = (rank, key, minOrMax) => {
    setRankRestrictions((draft) => {
      draft[key][minOrMax] = parseInt(rank);
    });
  };

  const updateRewardMats = (key, rewardId) => {
    setRewardMats((draft) => {
      draft[key] = parseInt(rewardId);
    });
  };

  const updateDayFlag = (index) => {
    setDayIndex(index);
  };

  const updateSeasonFlag = (index) => {
    setSeasonIndex(index);
  };

  const SaveParams = () => {
    let dv = questDataView;
    dv = WriteTimeLimit(dv, timeLimit * 1800);
    dv = WriteQuestFileId(dv, questFileId);
    dv = WriteRankRestriction(dv, rankRestriction);
    dv = WriteRewardMats(dv, rewardMats);
    dv = WriteStars(dv, stars);
    dv = WriteQuestRequirements(dv, questRequirements);
    setQuestDataView(dv);
  };

  const GenerateSeasonDayBitflag = () => {
    let isMandat = ReadMandatoryFlag(questDataView);
    let mandatFlag = isMandat === 2 ? 0 : 1;

    let dayValues = [0, 0];
    let seasonFlag = [0, 0, 0];

    if (dayIndex !== -1) dayValues[dayIndex] = 1;

    if (seasonFlag !== -1) seasonFlag[seasonIndex] = 1;

    console.log(dayValues);
    console.log(seasonFlag);

    let bitArray = [
      0,
      mandatFlag,
      0,
      ...dayValues.reverse(),
      ...seasonFlag.reverse(),
    ];
    let finalByte = ArrayToBitFlag(bitArray);

    return finalByte;
  };

  const generateQuestList = async () => {
    console.log("Generating Quest List...");

    let fileName = await save({
      filters: [
        {
          name: "Quest Binary",
          extensions: ["bin"],
        },
      ],
    });

    console.log("filename ", fileName);
    let questListArray = QuestToQuestList({
      dataView: questDataView,
      maxPlayers: maxPlayers,
      counterId: counterId,
      appealMark: appealMark,
      seasondaysflag: GenerateSeasonDayBitflag(),
    });
    let simpleArray = Array.from(questListArray);

    if (fileName)
      await invoke("save_byte_array_to_file", {
        path: fileName,
        bytes: simpleArray,
      });
  };

  return (
    <div className="p-4 flex flex-col gap-y-3 ">
      <Panel onSave={() => SaveParams()}>
        <PanelTitle title="Miscellaneous" />
        <h1 className="font-medium text-lg text-green-500">Quest Params</h1>
        <div className="flex flex-wrap gap-x-3 mb-6">
          <NumeralInput
            label={"Time Limit"}
            defaultValue={timeLimit}
            onChange={(value) => setTimeLimit(parseInt(value))}
          />
          <NumeralInput
            label={"Quest File ID"}
            defaultValue={questFileId}
            onChange={(value) => setQuestFileId(parseInt(value))}
          />
          <NumeralInput
            label={"Stars"}
            defaultValue={stars}
            onChange={(value) => setStars(parseInt(value))}
          />
        </div>
        <h2 className="font-medium text-lg text-green-500">
          Rank Restrictions
        </h2>
        <div className="flex flex-wrap gap-x-3 mb-6">
          <NumeralInput
            label={"Min Post Rank"}
            defaultValue={rankRestriction.postRank.min}
            onChange={(value) =>
              updateRankRestrictions(value, "postRank", "min")
            }
          />
          <NumeralInput
            label={"Max Post Rank"}
            defaultValue={rankRestriction.postRank.max}
            onChange={(value) =>
              updateRankRestrictions(value, "postRank", "max")
            }
          />
          <NumeralInput
            label={"Min Join Rank"}
            defaultValue={rankRestriction.joinRank.min}
            onChange={(value) =>
              updateRankRestrictions(value, "joinRank", "min")
            }
          />
          <NumeralInput
            label={"Max Join Rank"}
            defaultValue={rankRestriction.joinRank.max}
            onChange={(value) =>
              updateRankRestrictions(value, "joinRank", "max")
            }
          />
        </div>
        <h2 className="font-medium text-lg text-green-500">
          Quest Restrictions
        </h2>
        <div className="flex flex-wrap gap-x-3 mb-6">
          <SelectComponent
            title={"Quest Requirements"}
            defaultValue={questRequirements}
            options={requirements_options}
            onChange={(value) => setQuestRequirements(parseInt(value))}
          />
        </div>
        <h2 className="font-medium text-lg text-green-500">
          Rewards Mats (in the quest listing)
        </h2>
        <div className="flex flex-wrap gap-x-3 mb-6">
          <NumeralInput
            label={`Reward 1 ( ${
              rewardMats.reward1 >= 0 && rewardMats.reward1 < Items.length
                ? Items[rewardMats.reward1]
                : " "
            } )`}
            size={"xl"}
            defaultValue={rewardMats.reward1}
            onChange={(value) => updateRewardMats("reward1", value)}
          />
          <NumeralInput
            label={`Reward 2 ( ${
              rewardMats.reward2 >= 0 && rewardMats.reward2 < Items.length
                ? Items[rewardMats.reward2]
                : " "
            } )`}
            size={"xl"}
            defaultValue={rewardMats.reward2}
            onChange={(value) => updateRewardMats("reward2", value)}
          />
          <NumeralInput
            size={"xl"}
            label={`Reward 3 ( ${
              rewardMats.reward3 >= 0 && rewardMats.reward3 < Items.length
                ? Items[rewardMats.reward3]
                : " "
            } )`}
            defaultValue={rewardMats.reward3}
            onChange={(value) => updateRewardMats("reward3", value)}
          />
        </div>
      </Panel>

      <Panel
        onSave={() => generateQuestList()}
        onRevert={() => GenerateSeasonDayBitflag()}
      >
        <PanelTitle title="Events" />
        <div className="flex gap-x-3">
          <NumeralInput
            label={"Max Players"}
            defaultValue={maxPlayers}
            onChange={(value) => setMaxPlayers(parseInt(value))}
          />
          <SelectComponent
            title={"Counter ID"}
            defaultValue={counterId}
            options={CountersOptions}
            onChange={(value) => setCounterId(parseInt(value))}
          />
          <SelectComponent
            title={"Appeal Mark"}
            defaultValue={appealMark}
            options={appeal_options}
            onChange={(value) => setAppealMark(parseInt(value))}
          />
          <SelectComponent
            title={"Time of day"}
            defaultValue={dayIndex}
            options={event_day_options}
            onChange={(value) => updateDayFlag(value)}
          />
          <SelectComponent
            title={"Season"}
            defaultValue={seasonIndex}
            options={season_options}
            onChange={(value) => updateSeasonFlag(value)}
          />
        </div>
      </Panel>
    </div>
  );
};

export default MiscParams;
