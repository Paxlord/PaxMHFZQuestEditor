import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { appWindow } from '@tauri-apps/api/window';

import { ItemManager } from './ItemManager';


document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
document
  .getElementById('titlebar-maximize')
  .addEventListener('click', () => appWindow.toggleMaximize())
document
  .getElementById('titlebar-close')
  .addEventListener('click', () => appWindow.close())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ItemManager />
  </React.StrictMode>
)