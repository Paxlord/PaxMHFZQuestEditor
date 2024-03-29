import { useQuestData } from "./Hooks/useQuestData";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import OpenFile from "./Pages/OpenFile";
import EditorLayout from "./Pages/EditorLayout";
import QuestParams from "./Pages/QuestParams";
import BigMonsters from "./Pages/BigMonsters";
import SmallMonsters from "./Pages/SmallMonsters";
import Gatherables from "./Pages/Gatherables";
import QuestRewards from "./Pages/QuestRewards";
import QuestStrings from "./Pages/QuestStrings";
import Index from "./Pages/Index";
import MiscParams from "./Pages/MiscParams";
import EquipmentRestriction from "./Pages/EquipmentRestrictions";

const routerNoQuestData = createBrowserRouter([
  {
    path: "/",
    element: <OpenFile />,
  },
]);

const routerQuestData = createBrowserRouter([
  {
    path: "/",
    element: <EditorLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/questparams",
        element: <QuestParams />,
      },
      {
        path: "/miscparams",
        element: <MiscParams />,
      },
      {
        path: "/bigmonsters",
        element: <BigMonsters />,
      },
      {
        path: "/smallmonsters",
        element: <SmallMonsters />,
      },
      {
        path: "/gatherables",
        element: <Gatherables />,
      },
      {
        path: "/questrewards",
        element: <QuestRewards />,
      },
      {
        path: "/queststrings",
        element: <QuestStrings />,
      },
      {
        path: "/equipments",
        element: <EquipmentRestriction />,
      },
    ],
  },
]);

function App() {
  const { questDataView } = useQuestData();

  return (
    <RouterProvider
      router={questDataView ? routerQuestData : routerNoQuestData}
    />
  );
}

export default App;
