import { useState } from "react";
import { useImmer } from "use-immer";
import { NumeralInput } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadQuestFileId, ReadRankRestrictions, ReadRewardMats, ReadStars, ReadTimeLimit, WriteQuestFileId, WriteRankRestriction, WriteRewardMats, WriteStars, WriteTimeLimit } from "../Utils/QuestParams/misc_utils";
import { save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';
import { QuestToQuestList } from "../Utils/QuestParams/questlist_utils";



const MiscParams = () => {

  const { questDataView, setQuestDataView } = useQuestData();

  const [timeLimit, setTimeLimit] = useState(() => ReadTimeLimit(questDataView));
  const [questFileId, setQuestFileId] = useState(() => ReadQuestFileId(questDataView));
  const [rankRestriction, setRankRestrictions] = useImmer(() => ReadRankRestrictions(questDataView));
  const [rewardMats, setRewardMats] = useImmer(() => ReadRewardMats(questDataView));
  const [stars, setStars] = useState(() => ReadStars(questDataView));

  const [maxPlayers, setMaxPlayers] = useState(4);
  const [counterId, setCounterId] = useState(282);
  const [appealMark, setAppealMark] = useState(1);

  const updateRankRestrictions = (rank, key, minOrMax) => {
    setRankRestrictions(draft => {
      draft[key][minOrMax] = parseInt(rank)
    })
  }

  const updateRewardMats = (key, rewardId) => {
    setRewardMats(draft => {
      draft[key] = parseInt(rewardId)
    })
  } 

  const SaveParams = () => {
    let dv = questDataView;
    dv = WriteTimeLimit(dv, timeLimit);
    dv = WriteQuestFileId(dv, questFileId);
    dv = WriteRankRestriction(dv, rankRestriction);
    dv = WriteRewardMats(dv, rewardMats);
    dv = WriteStars(dv, stars);
    setQuestDataView(dv);
  }

  const generateQuestList = async () => {

    console.log("Generating Quest List...");

    let fileName = await save({
      filters: [{
        name: 'Quest Binary',
        extensions: ['bin']
      }]
    });

    console.log("filename ", fileName);
    let questListArray = QuestToQuestList({dataView: questDataView, maxPlayers: maxPlayers, counterId: counterId,  appealMark: appealMark});
    let simpleArray = Array.from(questListArray);

    if(fileName)
      await invoke("save_byte_array_to_file", { path: fileName, bytes: simpleArray})

  }

  return(
    <div  className="p-4 flex flex-col gap-y-3 ">
      <Panel onSave={() => SaveParams()}>
        <h1>Quest Params</h1>
        <div className="flex flex-wrap gap-x-3">
          <NumeralInput label={"Time Limit (Minutes * 1800)"} defaultValue={timeLimit} onChange={(value) => setTimeLimit(parseInt(value))} />
          <NumeralInput label={"Quest File ID"} defaultValue={questFileId} onChange={(value) => setQuestFileId(parseInt(value))} />
          <NumeralInput label={"Stars"} defaultValue={stars} onChange={(value) => setStars(parseInt(value))} />
        </div>
        <h2>Rank Restrictions</h2>
        <div className="flex flex-wrap gap-x-3">
          <NumeralInput label={"Min Post Rank"} defaultValue={rankRestriction.postRank.min} onChange={(value) => updateRankRestrictions(value, "postRank", "min")} />
          <NumeralInput label={"Max Post Rank"} defaultValue={rankRestriction.postRank.max} onChange={(value) => updateRankRestrictions(value, "postRank", "max")} />
          <NumeralInput label={"Min Join Rank"} defaultValue={rankRestriction.joinRank.min} onChange={(value) => updateRankRestrictions(value, "joinRank", "min")} />
          <NumeralInput label={"Max Join Rank"} defaultValue={rankRestriction.joinRank.max} onChange={(value) => updateRankRestrictions(value, "joinRank", "max")} />
        </div>
        <h2>Rewards Mats (in the quest listing)</h2>
        <div className="flex flex-wrap gap-x-3">
          <NumeralInput label={"Reward 1"} defaultValue={rewardMats.reward1} onChange={(value) => updateRewardMats("reward1", value)} />
          <NumeralInput label={"Reward 2"} defaultValue={rewardMats.reward2} onChange={(value) => updateRewardMats("reward2", value)} />
          <NumeralInput label={"Reward 3"} defaultValue={rewardMats.reward3} onChange={(value) => updateRewardMats("reward3", value)} />
        </div>
      </Panel>

      <Panel onSave={() => generateQuestList()}>
        <h1>Quest List Params</h1>
        <div className="flex flex-wrap gap-x-3">
          <NumeralInput label={"Max Players"} defaultValue={maxPlayers} onChange={(value) => setMaxPlayers(parseInt(value))} />
          <NumeralInput label={"Counter ID"}  defaultValue={counterId}  onChange={(value) => setCounterId(parseInt(value))} />
          <NumeralInput label={"Appeal Mark"} defaultValue={appealMark} onChange={(value) => setAppealMark(parseInt(value))} />
        </div>
      </Panel>

    </div>
  )
}

export default MiscParams;