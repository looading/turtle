import { Input, Form, Select } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

import React, { forwardRef, useImperativeHandle } from "react";
import { FC } from "react";

const FormItem = Form.Item


export interface EmailSenderFormStore {
  addresses: string[]
  user: string
  password: string
  title: string
  content: string
}

export interface EmailSenderRef {
  form: FormInstance<EmailSenderFormStore>
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


interface EmailSenderProps { }

export const EmailSender = forwardRef<EmailSenderRef, EmailSenderProps>(
  (props, ref) => {
    const [form] = Form.useForm<EmailSenderFormStore>()
    useImperativeHandle(ref, () => {
      return {
        form
      }
    })
    return (
      <Form
        form={form}
        {...layout}
      >
        <FormItem
          label='email Account'
          name='user'
          required
        >
          <Input
            placeholder='Gmail 发邮件的人的邮箱名，如"guiqi.zh@gmail.com"'
            type='email'
            autoSave='yes'
          />
        </FormItem>
        <FormItem
          label='email password'
          name='password'
          required
          help={
            <>
              gmail邮箱，需要开启低风险登录：<a href='https://myaccount.google.com/lesssecureapps' target='_blank'>https://myaccount.google.com/lesssecureapps</a>
              或者使用专用密码： <a href='https://security.google.com/settings/security/apppasswords' target='_blank'>https://security.google.com/settings/security/apppasswords</a>
            </>
          }
        >
          <Input.Password
            placeholder='发邮件的邮箱对应的密码'
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            autoSave='yes'
          />
        </FormItem>
        <FormItem
          label='send to'
          name='addresses'
          required
          initialValue={['946505808@qq.com']}
        >
          <Select
            mode='tags'
            maxTagCount={10}
          />

        </FormItem>
        <FormItem
          label='title'
          name='title'
          required
        >
          <Input
            placeholder='邮件 tile'
            autoSave='yes'
          />
        </FormItem>
        <FormItem
          label='content'
          name='content'
          required
        >
          <Input.TextArea
            showCount
            placeholder='邮件 content'
            autoSave='yes'
            maxLength={2000}
            rows={12}
          />
        </FormItem>
      </Form>
    )
  }
)

