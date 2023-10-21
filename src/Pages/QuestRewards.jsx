import { NumeralInput, TextArea } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { CreateEmptyBoxObj, ReadAllRewards, WriteRewards } from "../Utils/QuestParams/rewards_utils";

import { useState } from "react";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { ReadRewardVariant, WriteRewardVariant } from "../Utils/QuestParams/variant_utils";
import { Items } from "../Data/items";
import { BasicButton, PanelTitle } from "../Components/StyledComponents";
import NoButtonPanel from "../Components/NoButtonPanel";
import SelectComponent from "../Components/Form/SelectComponent";

const RewardOptions = [
  {
    value: 0,
    label: "First main fixed/Sub random"
  },
  {
    value: 1,
    label: "First main + First sub fixed"
  },
  {
    value: 2,
    label: "Fixed Rewards",
  },
  {
    value: 3,
    label: "Unknown but fixed ?"
  },
  {
    value: 4,
    label: "No fixed rewards"
  }
]

const QuestRewards = () => {

  const {questDataView, setQuestDataView } = useQuestData();

  const [rewards, setRewards] = useImmer(() => ReadAllRewards(questDataView));
  const [rewardFlag, setRewardFlag] = useState(() => ReadRewardVariant(questDataView));
  const [rewardImportStr, setRewardImportStr] = useState("");
  const [boxWasRemoved, setBoxWasRemoved] = useState(false);

  useEffect(() => {
    console.log(rewards);
  }, [rewards]);

  const updateReward = (key, value, indexItem, indexBox) => {
    setRewards(draft => {
      draft[indexBox].rewards[indexItem][key] = parseInt(value);
    })
  }

  const addBox = () => {

    if(rewards.length >= 5){
      console.error("Maximum amount of box reached");
      return;
    }

    setRewards(draft => {
      switch(draft.length){
        case 0:
          draft.push(CreateEmptyBoxObj(1, 24));
          break;
        case 1:
          draft.push(CreateEmptyBoxObj(2, 4));
          break;
        case 2:
          draft.push(CreateEmptyBoxObj(3, 4));
          break;
        case 3:
          draft.push(CreateEmptyBoxObj(4, 4));
          break;
        case 4:
          draft.push(CreateEmptyBoxObj(5, 4));
          break;
      }
    })
  }

  const deleteReward = (indexItem, indexBox) => {
    setRewards(draft => {
      draft[indexBox].rewards = draft[indexBox].rewards.filter((item, idx) => idx !== indexItem) ;


      //If Box has no reward delete it
      if(draft[indexBox].rewards.length === 0){
        draft.splice(indexBox, 1);
        setBoxWasRemoved(true);
      }
    })
  }

  const addReward = (indexBox) => {

    if(rewards[indexBox].rewards.length >= rewards[indexBox].rewardHeader.rewardMaxSlot){
      console.error("Maximum number of reward for this box attained");
      return;
    }

    setRewards(draft => {
      draft[indexBox].rewards.push({
        percent_chance: 0,
        item_id: 0,
        item_count: 0
      })
    })
  }

  const SaveRewards = () => {
    let dv = WriteRewards(questDataView, rewards);
    console.log("Pasasge 3");
    setQuestDataView(dv);
    setBoxWasRemoved(false);
  }

  const SaveFlag = () => {
    let dv = WriteRewardVariant(questDataView, rewardFlag);
    setQuestDataView(dv);
  }

  const beautifulRewards = () => {
    let string = "";
    rewards.forEach((reward) => {

      let rewardBoxId = reward.rewardHeader.rewardBoxId;
      switch(rewardBoxId){
        case 1:
          string += "Main Rewards :\n";
          break;
        case 2: 
          string += "Sub A Rewards :\n";
          break;
        case 3:
          string += "Sub B Rewards :\n";
          break;
      }

      reward.rewards.forEach((rewardItem) => {
        string += rewardItem.percent_chance;
        string += "% ";
        string += Items[rewardItem.item_id];
        string += " ";
        string += "x";
        string += rewardItem.item_count;
        string += "\n"
      });

      string += "\n";

    });

    return string;
  }

  return(
    <div className="p-4 flex flex-col gap-y-3 ">

      <Panel onSave={() => SaveFlag()}>
        <PanelTitle title="Flags" />
        <div className="flex gap-x-3 items-center">
        <SelectComponent title={"Reward Flag"} defaultValue={rewardFlag} options={RewardOptions} onChange={(value) => setRewardFlag(parseInt(value))} />
        </div>
      </Panel>

      <NoButtonPanel>
        <div className="flex items-center gap-x-3">
          <BasicButton onClick={() => addBox()} disabled={rewards.length >= 5}>Add Box {rewards.length + 1}</BasicButton>
          <BasicButton onClick={() => SaveRewards()} disabled={!boxWasRemoved}>Save Removed Boxes</BasicButton>
        </div>
      </NoButtonPanel>


      {
        rewards.map((reward, boxIdx) => {
          return (
          <Panel onSave={() => SaveRewards()}>
            <PanelTitle title={`Box number ${reward.rewardHeader.rewardBoxId}`} />
            <div className="flex gap-x-3 items-center">
              <button onClick={() => addReward(boxIdx)} className="transition h-8 px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700">Add a new Item</button>
              <p className={`text-lg ${reward.rewards.reduce((sum, rewardItem) => sum += rewardItem.percent_chance, 0)===100?'text-green-400':'text-red-400'} font-medium`} >Total Box Percentage {reward.rewards.reduce((sum, rewardItem) => sum += rewardItem.percent_chance, 0)}%</p>
            </div>
            <div className="flex flex-col gap-y-3 my-6">
              {
                reward.rewards.map((rewardItem, itemIdx) => {
                  return (
                  <div className="flex justify-evenly items-center">
                    <NumeralInput label={"Percentage Chance"} defaultValue={rewardItem.percent_chance} onChange={(value) => updateReward("percent_chance", value, itemIdx, boxIdx)} />
                    <NumeralInput label={"Item ID"} defaultValue={rewardItem.item_id} onChange={(value) => updateReward("item_id", value, itemIdx, boxIdx)}/>
                    <p className="w-36 translate-y-3 text-white">{rewardItem.item_id > 0 && rewardItem.item_id <= Items.length&& Items[rewardItem.item_id]}</p>
                    <NumeralInput label={"Item Count"} defaultValue={rewardItem.item_count} onChange={(value) => updateReward("item_count", value, itemIdx, boxIdx)} />
                    <button className="h-8 inline-block translate-y-3 transition px-4 py-1 hover:shadow-md bg-zinc-500 shadow-sm rounded text-white hover:bg-red-600 active:bg-red-700" onClick={() => deleteReward(itemIdx, boxIdx)}>Delete</button>
                  </div>)
                })
              }
            </div>
          </Panel>  
          )
        })
      }
      <Panel>
        <PanelTitle title={"Advanced Options"}/>
        <div className="flex gap-x-3 flex-wrap items-center">
          <TextArea defaultValue={JSON.stringify(rewards)} label="export rewards" />
          <TextArea label="import data" onChange={(value) => setRewardImportStr(value)}/>
          <button className="transition h-8 px-4 py-1 hover:shadow-md bg-green-500 shadow-sm rounded text-white hover:bg-green-600 active:bg-green-700" onClick={() => setRewards(JSON.parse(rewardImportStr))}>Import data</button>
          <TextArea defaultValue={beautifulRewards()} label="Beautiful Rewards" />
        </div>
      </Panel>
    </div>
  )
}

export default QuestRewards;