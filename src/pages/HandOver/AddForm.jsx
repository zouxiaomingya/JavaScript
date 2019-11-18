import React, { useState } from "react";
import { Form, Input, message, Row, Col, Button } from 'antd';

function AddForm({ form, handleCloseDrawer }) {
    const { getFieldDecorator, validateFields } = form
    const formItemLayout = {
        labelCol: {
            sm: { span: 4 },
        },
        wrapperCol: {
            sm: { span: 18 },
        },
    };

    const handleSubmit = () => {
        validateFields((errors, values) => {
            if (errors) return false;
            console.log(values);
            handleCloseDrawer();
            success();
        });
    }
    const success = () => {
        message.success('提交成功！');
    };

    return (
        <>
            <Form {...formItemLayout} className="login-form">
                <Form.Item label="姓名">
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '名字一定要有噢!' }],
                    })(
                        <Input placeholder="请输入名字" />,
                    )}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('password', {})(
                        <Input placeholder="请输入密码" />,
                    )}
                </Form.Item>
                <Row>
                    <Col span={4} />
                    <Button style={{ marginRight: 8 }} onClick={handleCloseDrawer}>取消</Button>
                    <Button type='primary' onClick={handleSubmit}>提交</Button>
                </Row>
            </Form >
        </>
    );
}
export default Form.create()(AddForm);
