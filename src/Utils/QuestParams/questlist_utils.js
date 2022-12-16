import { ReadFee, ReadMainObjCurrency, ReadSubACurrency, ReadSubBCurrency } from "./currency_utils";
import { ReadEquipmentRestrictions } from "./equipment_utils";
import { ReadAllFlags } from "./flag_utils";
import { ReadQuestFileId, ReadQuestLocale, ReadQuestRestrictions, ReadRankRestrictions, ReadRewardMats, ReadTimeLimit } from "./misc_utils";
import { ReadMainObjective, ReadMandatoryFlag, ReadSubAObjective, ReadSubBObjective } from "./objective_utils";
import { ReadQuestStrings } from "./string_utils";

export const QuestToQuestList = ({questId, dataView, maxPlayers, counterId, }) => {

  let questListLength = 374; //374 without strings
	let questStrings = ReadQuestStrings(dataView);

	let currencyMainReward = ReadMainObjCurrency(dataView);
	let currencySubAReward = ReadSubACurrency(dataView);
	let currencySubBReward = ReadSubBCurrency(dataView);

	let questMainObj = ReadMainObjective(dataView);
	let questSubAObj = ReadSubAObjective(dataView);
	let questSubBObj = ReadSubBObjective(dataView);

	let stringSignature = [0x00, 0x12, 0x83, 0x59, 0x89, 0x5b, 0x83, 0x3a, 0x58, 0xb6, 0x8e, 0x59, 0x82, 0xcc, 0x83, 0x58, 0x83, 0x58, 0x83, 0x81];

	let questStringsLength = questStrings.reduce((acc, string) => {
		return acc + string.sjisArray.length;
	}, 0);

	let questListArray = new Uint8Array( questListLength + questStringsLength + stringSignature.length );
	let questListDataView = new DataView(questListArray.buffer);

	let curOffset = 0x0;

	//Random ID
	questListDataView.setUint32(curOffset, 880000, true);
	curOffset += 4;

	//Padding 5 bytes
	questListDataView.setUint32(curOffset, 0, true);
	curOffset += 4;
	questListDataView.setUint8(curOffset, 0);
	curOffset += 1;

	//Max Players
	questListDataView.setUint8(curOffset, 4);
	curOffset += 1;

	//Counter ID
	questListDataView.setUint16(curOffset, 282, true);
	curOffset += 2;

	//Padding 5 bytes
	questListDataView.setUint32(curOffset, 0, true);
	curOffset += 4;
	questListDataView.setUint8(curOffset, 0);
	curOffset += 1;

	//Appeal
	questListDataView.setUint8(curOffset, 1);
	curOffset += 1;

	//Padding 2 bytes
	questListDataView.setUint16(curOffset, 0, true);
	curOffset += 2;

	//Size Check
	questListDataView.setUint8(curOffset, 2);
	curOffset += 1;
	questListDataView.setUint8(curOffset, (questListLength + questStringsLength + stringSignature.length) - 553 );
	curOffset += 1;

	//Padding 2 bytes
	questListDataView.setUint16(curOffset, 0, true);
	curOffset += 2;

	//Obj Type 
	questListDataView.setUint8(curOffset, 0);
	curOffset += 1;

	//Padding 1 Byte
	questListDataView.setUint8(curOffset, 0);
	curOffset += 1;

	//Stars
	questListDataView.setUint8(curOffset, 7);
	curOffset += 1;

	//Course Requirement, determine IDs Later
	questListDataView.setUint16(curOffset, 4865, true);
	curOffset += 2;

	//Padding 5 bytes
	questListDataView.setUint32(curOffset, 0, true);
	curOffset += 4;
	questListDataView.setUint8(curOffset, 0);
	curOffset += 1;

	//Quest Fee
	questListDataView.setUint32(curOffset, ReadFee(dataView), true);
	curOffset += 4;

	//Reward Main
	questListDataView.setUint32(curOffset, currencyMainReward.zennyReward, true);
	curOffset += 4;

	//Reward SubA
	questListDataView.setUint32(curOffset, currencySubAReward.zennyReward, true);
	curOffset += 4;

	//Reward SubB
	questListDataView.setUint32(curOffset, currencySubBReward.zennyReward, true);
	curOffset += 4;

	//Padding 4 bytes
	questListDataView.setUint32(curOffset, 0, true);
	curOffset += 4;

	//Quest time
	questListDataView.setUint32(curOffset, ReadTimeLimit(dataView), true);
	curOffset += 4;

	//Quest time
	questListDataView.setUint32(curOffset, ReadQuestLocale(dataView), true);
	curOffset += 4;

	//Probably string start addr but +32 offset for some reason ?
	questListDataView.setUint32(curOffset, 320, true);
	curOffset += 4;

	//Restrictions
	questListDataView.setUint16(curOffset, ReadQuestRestrictions(dataView), true);
	curOffset += 2;

	//Quest File ID
	questListDataView.setUint16(curOffset, ReadQuestFileId(dataView), true);
	curOffset += 2;

	//Quest Main Obj
	questListDataView.setUint32(curOffset, questMainObj.objType, true);
	curOffset += 4;
	questListDataView.setUint16(curOffset, questMainObj.objTarget, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, questMainObj.objAmount, true);
	curOffset += 2;

	//Quest Sub A
	questListDataView.setUint32(curOffset, questSubAObj.objType, true);
	curOffset += 4;
	questListDataView.setUint16(curOffset, questSubAObj.objTarget, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, questSubAObj.objAmount, true);
	curOffset += 2;

	//Quest Sub B
	questListDataView.setUint32(curOffset, questSubBObj.objType, true);
	curOffset += 4;
	questListDataView.setUint16(curOffset, questSubBObj.objTarget, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, questSubBObj.objAmount, true);
	curOffset += 2;

	//Quest mandat flag
	questListDataView.setUint16(curOffset, ReadMandatoryFlag(dataView), true);
	curOffset += 2;

	//Quest Rank Restrictions
	let rankRestrictions = ReadRankRestrictions(dataView);
	questListDataView.setUint16(curOffset, rankRestrictions.postRank.min, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, rankRestrictions.postRank.max, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, rankRestrictions.joinRank.min, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, rankRestrictions.joinRank.max, true);
	curOffset += 2;

	//8 Bytes Skip
	questListDataView.setUint32(curOffset, 0, true);
	curOffset += 4;
	questListDataView.setUint32(curOffset, 0, true);
	curOffset += 4;

	//Equipment Restrictions
	let equipmentRestrictions = ReadEquipmentRestrictions(dataView);
	questListDataView.setUint16(curOffset, equipmentRestrictions.legs.piece_id, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.legs.deco_1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.legs.deco_2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.legs.deco_3, true);
	curOffset += 2;

	questListDataView.setUint16(curOffset, equipmentRestrictions.weapon.piece_id, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.weapon.deco_1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.weapon.deco_2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.weapon.deco_3, true);
	curOffset += 2;

	questListDataView.setUint16(curOffset, equipmentRestrictions.head.piece_id, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.head.deco_1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.head.deco_2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.head.deco_3, true);
	curOffset += 2;

	questListDataView.setUint16(curOffset, equipmentRestrictions.chest.piece_id, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.chest.deco_1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.chest.deco_2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.chest.deco_3, true);
	curOffset += 2;

	questListDataView.setUint16(curOffset, equipmentRestrictions.arms.piece_id, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.arms.deco_1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.arms.deco_2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.arms.deco_3, true);
	curOffset += 2;

	questListDataView.setUint16(curOffset, equipmentRestrictions.waist.piece_id, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.waist.deco_1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.waist.deco_2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, equipmentRestrictions.waist.deco_3, true);
	curOffset += 2;

	//Restriction Byte skip
	questListDataView.setUint32(curOffset, equipmentRestrictions.unk_equip, true);
	curOffset += 4;
	questListDataView.setUint16(curOffset, 0, true);
	curOffset += 2;

	//Quest Flags
	let flags = ReadAllFlags(dataView);
	questListDataView.setUint8(curOffset, flags.reward_flag);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.monster_flag1);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.monster_flag2);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.map_flag);
	curOffset += 1;
	questListDataView.setUint16(curOffset, flags.item_req_type, true);
	curOffset += 2;
	questListDataView.setUint8(curOffset, flags.item_req_count);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.quest_flag1);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.quest_flag2);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.quest_flag3);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.quest_flag4);
	curOffset += 1;
	questListDataView.setUint8(curOffset, flags.unk_flag);
	curOffset += 1;

	//Unks
	questListDataView.setUint32(curOffset, dataView.getUint32(0x15c, true), true);
	curOffset += 4;
	questListDataView.setUint32(curOffset, dataView.getUint32(0x160, true), true);
	curOffset += 4;

	//Points/Zenny
	questListDataView.setUint32(curOffset, dataView.getUint32(0x164, true), true);
	curOffset += 4;
	questListDataView.setUint32(curOffset, dataView.getUint32(0x168, true), true);
	curOffset += 4;
	questListDataView.setUint32(curOffset, dataView.getUint32(0x16c, true), true);
	curOffset += 4;

	//Reward Mats
	let questRewards = ReadRewardMats(dataView);
	questListDataView.setUint16(curOffset, questRewards.reward1, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, questRewards.reward2, true);
	curOffset += 2;
	questListDataView.setUint16(curOffset, questRewards.reward3, true);
	curOffset += 2;

	//EoF Quest
	for(let i =0; i < 138; i++){
		questListDataView.setUint8((curOffset+i), dataView.getUint8(0x176 + i));
		curOffset++
	}

	//StringsSection
	
	//StringsPointers
	let basePointer = 352;

	for(let i = 0; i < 8; i++){
		questListDataView.setUint32(curOffset, basePointer, true);
		curOffset += 4;
		basePointer += questStrings[i].sjisArray.length;
	}

	for(let i = 0; i<8; i++){
		for(let j = 0; j < questStrings[i].sjisArray.length; j++){

			questListDataView.setUint8(curOffset, questStrings[i].sjisArray[j]);
			curOffset++

		}
	}

	for(let i = 0; i < stringSignature.length; i++){
		questListDataView.setUint8(curOffset, stringSignature[i]);
		curOffset++
	}

	return questListArray;

}