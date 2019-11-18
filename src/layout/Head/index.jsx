  
import React from 'react';
import { Layout } from 'antd';
const { Header } = Layout;
function Head() {
  return (
    <Header className="header" style={{ color: '#fff' }}>
      <div className="logo" >
        我是头部
      </div>
    </Header>
  )
}

export default Head;