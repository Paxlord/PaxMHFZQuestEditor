import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { appWindow } from '@tauri-apps/api/window';

import { ItemManager } from './ItemManager';
import { ToastContainer, Slide } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

document.addEventListener('contextmenu', event => event.preventDefault());
document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
// document
//   .getElementById('titlebar-maximize')
//   .addEventListener('click', () => appWindow.toggleMaximize())
// document
//   .getElementById('titlebar-close')
//   .addEventListener('click', () => appWindow.close())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ItemManager />
    <ToastContainer 
          position="bottom-left"
          transition={Slide}
          autoClose={500}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          />
  </React.StrictMode>
)