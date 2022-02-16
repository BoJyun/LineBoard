import React, { useEffect, useState } from 'react';
import { AppContext } from './api';
import { Form, Input, Button,Select,Switch } from 'antd';

const FormLayoutDemo = (props) => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('horizontal');
    const [chamber,setChamber]=useState("")
    const appCtx = React.useContext(AppContext);
    // const onFormLayoutChange = ({ layout }) => {
    //   setFormLayout(layout);
    // };

  React.useEffect(()=>{
    setChamber(props.chamber)
  },[props.chamber])

    const formItemLayout =
      formLayout === 'horizontal'
        ? {
            labelCol: {
              span: 4,
            },
            wrapperCol: {
              span: 14,
            },
          }
        : null;
    const buttonItemLayout =
      formLayout === 'horizontal'
        ? {
            wrapperCol: {
              span: 14,
              offset: 4,
            },
          }
        : null;
    return (
        <div class="c">
            <div style={{textAlign: "center"}}>
              <font size="6">Register</font><br/>
            </div>
            <Form
                {...formItemLayout}
                layout={formLayout}
                form={form}
                initialValues={{
                layout: formLayout,
                }}
                onFinish={(values) => {appCtx.fetchRegister({
                  "name":values.name,"RD": values.RD,"extension_num":values.extension_num,"model":values.model,
                  "circle":values.circle,"cutline":values.cutline,"chamber":chamber});
                  form.resetFields();
                  props.onSuccess();
                }}
            >
                <Form.Item label="使用者" name="name" rules={[{ required: true, message: '帳號不可以空白!' }]}>
                <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item label="工號" name="RD" rules={[{ required: true,  message: '只能輸入數字!' ,pattern: /^[0-9]+$/ }]}>
                <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item label="分機" name="extension_num" rules={[{ required: true, message: '帳號不可以空白!' }]}>
                <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item label="Model" name="model">
                    <Select>
                        <Select.Option value="LTE+WiFi">LTE+WiFi</Select.Option>
                        <Select.Option value="LTE">LTE</Select.Option>
                        <Select.Option value="WiFi">WiFi</Select.Option>
                        <Select.Option value="GPS">GPS</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="圈數" name="circle" rules={[{ required: true, message: '只能輸入數字!' ,pattern: /^[0-9]+$/}]}>
                <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item name="cutline" label="差測" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item {...buttonItemLayout}>
                <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
      </div>
    );
  };

  export default FormLayoutDemo;