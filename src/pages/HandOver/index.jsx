/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";

import { Card, Input, Button, Select, Table, Drawer } from 'antd';
import { mockList } from './mock';
import AddForm from './AddForm';
import './index.css';

const { Search } = Input;
const { Option } = Select;

function HandOver() {
  const [visible, setVisible] = useState(false);
  const [handoverType, sethandoverType] = useState('get');
  const [inputValue, setinputValue] = useState();

  const onChange = (value) => {
    sethandoverType(value);
    console.log(handoverType + inputValue);
  }

  const searchUerName = (value) => {
    setinputValue(value)
    console.log(value + handoverType);
  }

  const handleDel = (id) => {
    console.log(id);
  }

  const renderOperate = () => (
    <>
      <Select onChange={onChange} defaultValue="get" value={handoverType} style={{ width: 120 }}>
        <Option value="get">交给我的</Option>
        <Option value="give">交给他人</Option>
      </Select>
      <Search style={{ width: 250, paddingLeft: 8 }} placeholder="input search text" onSearch={value => searchUerName(value)} enterButton />
    </>
  );

  const stateMap = {
    'on': 'dakai',
    'off': 'shibai',
    'close': 'guanbi',
  }
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '花名',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => stateMap[text]
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      render: (_text, { id }) => (
        <>
          <span className='operateButton' style={{ paddingRight: 4 }} >查看</span>
          <span className='operateButton' onClick={() => handleDel(id)}>删除</span>
        </>
      )
    },
  ];

  const handleCloseDrawer = () => setVisible(false);
  const handleOpenDrawer = () => setVisible(true);

  return (
    <>
      <Card
        style={{ width: '100%' }}
        bordered={false}
        size="small"
        title={renderOperate()}
        extra={<Button type='primary' onClick={() => { handleOpenDrawer() }} >新增交接</Button>}
      >
        <Table columns={columns} dataSource={mockList} rowKey='id' />
      </Card>
      <Drawer
        title="新增一键交接"
        placement="right"
        closable={false}
        onClose={handleCloseDrawer}
        visible={visible}
        width={600}
      >
        <AddForm handleCloseDrawer={handleCloseDrawer} />
      </Drawer>
    </>

  );
}

export default HandOver;
