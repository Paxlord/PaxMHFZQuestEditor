import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

import { QuestDataProvider } from './Hooks/useQuestData';
import { appWindow } from '@tauri-apps/api/window';

document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
document
  .getElementById('titlebar-maximize')
  .addEventListener('click', () => appWindow.toggleMaximize())
document
  .getElementById('titlebar-close')
  .addEventListener('click', () => appWindow.close())

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuestDataProvider>
      <App />
    </QuestDataProvider>
  </React.StrictMode>
);
