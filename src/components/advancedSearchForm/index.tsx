import React, { FC, forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Row, Col, Input, Button, Select, Switch } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { FormInstance, Rule } from 'antd/lib/form';
import { SelectProps } from 'antd/lib/select';
import { InputProps } from 'antd/lib/input';
import { SwitchProps } from 'antd/lib/switch';

interface Item {
  label: string
  name: string
  initialValue?: any
  options: {
    rules?: Rule[]
  }
}

interface SelectItem extends Item {
  type: 'Select'
  props: SelectProps<any>
}

interface InputItem extends Item {
  type: 'Input'
  props: InputProps
}

interface SwitchItem extends Item {
  type: 'Switch'
  props: SwitchProps
}

export type CommonItem = 
  | SelectItem 
  | InputItem
  | SwitchItem


const ControlMap = {
  Input,
  Select,
  Switch
}

interface AdvancedSearchFormProps {
  items: CommonItem[]
  onSearch: (values: any) => void
  loading?: boolean
}

export interface AdvancedSearchFormRef {
  form: FormInstance<any>
}

export const AdvancedSearchForm = forwardRef<{
  form: FormInstance<any>
}, AdvancedSearchFormProps>(
  (props, ref) => {
    const {
      items,
      onSearch,
      loading = false
    } = props
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();
  
    useImperativeHandle(ref, () => {
      return {
        form
      }
    })
    
    const getFields = () => {
      const count = expand ? 10 : 6;
      const children = items.slice(0 , count).map(
        item => {
          const Comp = ControlMap[item.type]
          return (
            <Col span={8} key={item.name}>
              <Form.Item
                name={item.name}
                label={item.label}
                rules={item.options.rules ?? []}
                initialValue={item.initialValue}
              >
                <Comp {...item.props as any} />
              </Form.Item>
            </Col>
          )
        }
      );
      return children;
    };
  
    const onFinish = values => {
      onSearch(values)
    };
  
    return (
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Search
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              Clear
            </Button>
            <a
              style={{ fontSize: 12 }}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {expand ? <UpOutlined /> : <DownOutlined />} Collapse
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
)