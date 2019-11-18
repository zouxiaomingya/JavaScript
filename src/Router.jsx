import React from "react";
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";
import Home from './pages/Home';
import handover from './pages/handover';
import Page404 from './pages/Page404'
const { Content } = Layout;

export const routerConfig = [
  {
    path: '/home',
    icon: 'home',
    text: '主页',
    component: Home,
  }, {
    path: '/handover',
    icon: 'home',
    text: '交接工作',
    component: handover,
  }
];
function Router() {
  return (
    <Content
      style={{
        background: "#fff",
        padding: 24,
        margin: 0,
        minHeight: 280
      }}
    >
      {/* exact 严格模式匹配完整的路由*/ }
      <Switch>
        {routerConfig.map(({ path, component }) => (
          <Route exact key={path} path={path} component={component} />
        ))}
        <Route component={Page404} /> 
      </Switch>
    </Content>
  )
}

export default Router;