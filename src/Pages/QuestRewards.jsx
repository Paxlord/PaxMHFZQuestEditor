import { NumeralInput } from "../Components/Form/InputComponent";
import Panel from "../Components/Panel";
import { useQuestData } from "../Hooks/useQuestData";
import { ReadAllRewards } from "../Utils/QuestParams/rewards_utils";

import { useState } from "react";

const QuestRewards = () => {

  const {questDataView } = useQuestData();

  const [rewards, setRewards] = useState(ReadAllRewards(questDataView));

  return(
    <div className="p-4 flex flex-col gap-y-3 ">
      {
        rewards.map((reward) => {
          return (
          <Panel>
            <h1>{reward.rewardHeader.rewardBoxId}</h1>
            <div className="flex flex-col gap-y-3">
              {
                reward.rewards.map((rewardItem) => {

                  console.log(rewardItem);

                  return <div className="flex justify-evenly">
                    <NumeralInput label={"percent_chance"} defaultValue={rewardItem.percent_chance} />
                    <NumeralInput label={"itemId"} defaultValue={rewardItem.item_id} />
                    <NumeralInput label={"item_count"} defaultValue={rewardItem.item_count} />
                  </div>
                })
              }
            </div>
          </Panel>  
          )
        })
      }
    </div>
  )
}

export default QuestRewards;