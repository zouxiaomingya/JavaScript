import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from "react-router-dom";

const { Sider } = Layout;
function Side({ routerConfig,location }) {
  const { pathname } = location;
  // const filterPathName = `/${pathname.split('/')[1]}`
  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        style={{ height: '100%', borderRight: 0 }}
      >
        {routerConfig.map((item) => (
          <Menu.Item key={item.path}>
            <Link to={item.path}>
              <Icon type={item.icon} />
              {item.text}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  )
}

export default withRouter(Side);