import { Form, Slider, message, Layout, Input, Radio, Select, } from 'antd';
import React from 'react';
import { login } from "../../middleware/users"
import { withRouter } from 'react-router-dom'
import { PushpinOutlined,HomeOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';
import API from '../../middleware/api';
import Auth from '../../auth/ProtectedRoute';
const { Search } = Input;

class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {

        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values.email, values)
                let payload = {
                    email: values.email,
                    password: values.password
                }
                let response = await login({ ...payload })
                Auth.authenticate()
                this.props.history.push('/')
                console.log(response)
                localStorage.setItem("user_id", response.data.id)

                message.success(response.data.msg, 5);
            }
        });
    };
    handleChange=(value)=>
    {
        console.log("Value",value)
    }

    render() {
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (



            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item name="radio-button" label="Loaction">
                    <Radio.Group onChange={this.handleChange}  value={'a'}>
                        <Radio.Button value="a"><PushpinOutlined style={{padding:'2px'}}/>Near By</Radio.Button>
                        <Radio.Button value="b">All</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="slider" label="Feedback">
                    <Slider  onChange={this.handleChange}
                        marks={{
                            0: '0',
                            20: '20',
                            40: '40',
                            60: '50',
                            80: '60',
                            100: '70',
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="select"
                    label="Name"
                    hasFeedback
                    rules={[{ required: true, message: 'Please select your cateogory' }]}
                >
                    <Search
                     onChange={this.handleChange}
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 200 }}
                    />
                </Form.Item>

                <Form.Item name="radio-group" label="Cateogory">
                    <Radio.Group  onChange={this.handleChange}>
                        <Radio value="culturals">Culturals</Radio>
                        <Radio value="technical">Technical</Radio>
                        <Radio value="sports">Sports</Radio>
                        <Radio value="others">Others</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>

        );
    }
}

export const WrappedFilter = Form.create({ name: 'normal_login' })(withRouter(FilterForm));