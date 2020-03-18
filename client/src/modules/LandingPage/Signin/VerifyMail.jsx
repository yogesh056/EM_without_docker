
import React from 'react';
import 'antd/dist/antd.css';
import {
    Drawer,
    Form,
    Input,
    Select,
    Row,
    Col,
    Icon,
    Steps,
    DatePicker,
    message,
    Button,
    Layout
} from 'antd';
import moment from 'moment';
import API from '../../../middleware/api';
import { withRouter } from 'react-router'

const { Option } = Select;
class VerifyMail extends React.Component {
    constructor(props)
{
        super(props);
        this.state = {
          confirmDirty: false,
          autoCompleteResult: [],
        };
    }


    handleSubmit =(e)=> {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async(err, values) => {
            if (!err) {
                console.log(this.props.value)
                let response
                this.props.value.secretKey = values.secretKey
                try{
                    response = await API.post('/users/signin',
                    {
                        "first_name": this.props.value.first_name,
                        "last_name": this.props.value.last_name,
                        "user_name": this.props.value.user_name,
                        "password": this.props.value.password,
                        "secretKey": values.secretKey,
                        "email": this.props.value.email,
                        "phone": this.props.value.phone,
                        "dob": this.props.value.dob,
                        "college": 1,
                        "city": 1,
                        "state": 1,
                        "gender": this.props.value.gender,
                        "image": this.props.value.image
                    })
                    if(response.data.code===200)
                    {message.success(response.data.msg,4)
                        this.props.history.push("/login")
                    }
                    else{
                        message.error(response.data.msg,4); 
                    }
                    console.log(response.data)
                    // this.props.next(values)
                 
                  }
                  catch(e)
                  {
                  console.log(e)
                  }
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };


    render() {
        const { current } = this.state;

        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>


                <Form.Item label="Secret Key" extra="We must make sure that your are a valid user.">
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('secretKey', {
                                rules: [{ required: true, message: 'Please input the secret key you got!' }],
                            })(<Input />)}
                        </Col>
                        <Col span={12}>
                            <Button>Re-Send</Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Register
          </Button>
                <Button onClick={this.props.previous}>
                    Previous
          </Button>
            </Form>

        );
    }
}
export const WrappedVerifyMail = Form.create({ name: 'register' })(withRouter(VerifyMail));
