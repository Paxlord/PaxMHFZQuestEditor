import { NumeralInput, TextArea } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadAllRewards, WriteRewards } from "../Utils/QuestParams/rewards_utils";

import { useState } from "react";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { ReadRewardVariant, WriteRewardVariant } from "../Utils/QuestParams/variant_utils";
import { Items } from "../Data/items";

const QuestRewards = () => {

  const {questDataView, setQuestDataView } = useQuestData();

  const [rewards, setRewards] = useImmer(() => ReadAllRewards(questDataView));
  const [rewardFlag, setRewardFlag] = useState(() => ReadRewardVariant(questDataView));
  const [rewardImportStr, setRewardImportStr] = useState("");

  const updateReward = (key, value, indexItem, indexBox) => {
    setRewards(draft => {
      draft[indexBox].rewards[indexItem][key] = parseInt(value);
    })
  }

  const deleteReward = (indexItem, indexBox) => {
    setRewards(draft => {
      draft[indexBox].rewards = draft[indexBox].rewards.filter((item, idx) => idx !== indexItem) ;


      //If Box has no reward delete it
      if(draft[indexBox].rewards.length === 0){
        draft.splice(indexBox, 1);
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
        <NumeralInput label={"Reward Flag"} defaultValue={rewardFlag} onChange={(value) => setRewardFlag(parseInt(value))} />
      </Panel>


      {
        rewards.map((reward, boxIdx) => {
          return (
          <Panel onSave={() => SaveRewards()}>
            <h1>Box number {reward.rewardHeader.rewardBoxId}</h1>
            <button onClick={() => addReward(boxIdx)} className="transition px-4 py-1 hover:shadow-md bg-violet-400 shadow-sm rounded text-white hover:bg-violet-500 active:bg-violet-600">Add a new Item</button>
            <div className="flex flex-col gap-y-3">
              {
                reward.rewards.map((rewardItem, itemIdx) => {
                  return (<div className="flex justify-evenly items-center">
                    <NumeralInput label={"percent_chance"} defaultValue={rewardItem.percent_chance} onChange={(value) => updateReward("percent_chance", value, itemIdx, boxIdx)} />
                    <NumeralInput label={"itemId"} defaultValue={rewardItem.item_id} onChange={(value) => updateReward("item_id", value, itemIdx, boxIdx)}/>
                    <p className="w-36">{rewardItem.item_id > 0 && rewardItem.item_id <= Items.length&& Items[rewardItem.item_id]}</p>
                    <NumeralInput label={"item_count"} defaultValue={rewardItem.item_count} onChange={(value) => updateReward("item_count", value, itemIdx, boxIdx)} />
                    <button className="h-8 inline-block transition px-4 py-1 hover:shadow-md bg-violet-400 shadow-sm rounded text-white hover:bg-violet-500 active:bg-violet-600" onClick={() => deleteReward(itemIdx, boxIdx)}>Delete</button>
                  </div>)
                })
              }
            </div>
          </Panel>  
          )
        })
      }
      <Panel>
        <h1>Item Manager</h1>
        <div className="flex gap-x-3 flex-wrap">
          <TextArea defaultValue={JSON.stringify(rewards)} label="export rewards" />
          <TextArea label="import data" onChange={(value) => setRewardImportStr(value)}/>
          <button onClick={() => setRewards(JSON.parse(rewardImportStr))}>Import data</button>
          <TextArea defaultValue={beautifulRewards()} label="Beautiful Rewards" />
        </div>
      </Panel>
    </div>
  )
}

export default QuestRewards;