# Pax's MHFZ Quest Editor

This is the full release of my personal quest editor i've been using for the past year or so. 
Even though I've made a good amount of quests with it and it has worked pretty flawlessly for all of them, this is still pretty experimental and you're bound to find some bugs/issues while using it.

If you have some requests, issues or just have questions feel free to raise an issue on this repository or shoot me a DM on Discord @pax_777

## Caution

- Frontier is an old game kept up mostly through years of thoughts and prayers, despite the quest format initially looking pretty permissive, there are A LOT of hardcoded stuff related to them. Some combinations of monsters might not work, putting some monsters in specific maps might crash the game, you might have some trouble with forced equipments not working for seemingly unknown reasons... that's just how the game is and you'll have to trial and error stuff until it works
- This editor is not feature complete, You can find a list of missing features at the bottom of the README


## How to use

1. When you first open the editor, you'll be pompted to open a quest file, please be sure to only open a Decompressed quest file (through the use of a tool like ReFrontier)

![image](https://github.com/Paxlord/PaxMHFZQuestEditor/assets/19719025/e1fa0203-6b56-4c38-82a4-030bc23d1618)

   
2. Then you can edit the quest to your heart's content, donc forget to press the save button after you're done with a category

![image](https://github.com/Paxlord/PaxMHFZQuestEditor/assets/19719025/a8f758c7-c20b-4431-82d4-f95bef8fc54c)
   
3. Once you're done you can choose to either save a single quest file or 3 quest files at the same time, if you chose 3 quests file 0,1,2 will be appended to your quest name (sor for example saving 65788d will create 65788d0.bin, 65788d1.bin and 65788d2.bin

![image](https://github.com/Paxlord/PaxMHFZQuestEditor/assets/19719025/eef26298-53fe-4701-8cc5-4f785159627e)


## Contibuting

Any PR or contribution is welcome, I have not yet done a clean up of the source code so there might be some dead/unused code 

### Building

To start contibuting you can just clone the repo run ```yarn``` to install the dependerncies and then you can run the app using ```yarn tauri dev``` 
Be sure to have Node and Rust installed. 

## Future plans

Here's a screenshot of my To-Do list sorted by what's more likely to get done, it's bound to evolve with time so I'll try to keep it up to date: 

![image](https://github.com/Paxlord/PaxMHFZQuestEditor/assets/19719025/1a7186b1-70c9-4eb3-bd23-e93560eece1a)

## Thanks

- Fist, for giving me some intial information and pointers about the quest structure at the start
- Malckyor, for information about the quest flags and quest lists
- Seph, for general testing and a lot of ideas
