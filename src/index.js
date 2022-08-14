import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter} from "react-router-dom";

//导入axios配置文件
import './util/http'

//导入图标组件库
import './assets/fonts/iconfont.css'

//导入react-virtualized样式文件
import 'react-virtualized/styles.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

