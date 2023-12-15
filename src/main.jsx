import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

import { QuestDataProvider } from './Hooks/useQuestData';
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
document
  .getElementById('titlebar-close')
  .addEventListener('click', () => {
    WebviewWindow.getByLabel("item").close();
    appWindow.close();
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuestDataProvider>
      <App />
      <ToastContainer position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          />
    </QuestDataProvider>
  </React.StrictMode>
);
