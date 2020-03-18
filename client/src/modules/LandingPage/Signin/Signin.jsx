
import React from 'react';
import 'antd/dist/antd.css';
import { storage } from '../../../firebase/index';
import {
  Drawer,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Icon,
  Upload,
  message,
  Button,
  Layout
} from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router'
import API from '../../../middleware/api';
const { Option } = Select;
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  }
  uploadImage = (info) => {
    const img = info.file.originFileObj;
    this.setState(({ img, loading: true }));
    const uploadTask = storage.ref(`images/${img.name}`).put(img);
    uploadTask.on('state_changed', (snapshot) => { },
      (error) => { console.log(error) },
      () => {
        storage.ref('images').child(img.name).getDownloadURL().then(url => {
          this.setState({ imgurl: url, loading: false }, () => {
            console.log('123', this.state.imgurl)
          })
        })
      })
  }
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.image = this.state.imgurl
        console.log(values)
        let response
        try {
          response = await API.post('/users/verify', { email: values.email })
          console.log(response)
          response.data.code === 200 ? message.success(response.data.msg, 4) : message.error(response.data.msg, 4);
          this.props.next(values)
        }
        catch (e) {
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
    const { getFieldDecorator } = this.props.form;
    const { imgurl, loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <Icon type="loading" /> : <Icon type="plus" />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );


    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="First Name">
              {getFieldDecorator('first_name', {
                rules: [{ required: true, message: 'Please enter First Name' }],
              })(<Input placeholder="Please enter First Name" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Last Name">
              {getFieldDecorator('last_name', {
                rules: [{ required: true, message: 'Please enter Last Name' }],
              })(
                <Input placeholder="Please enter Last Name" />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="User Name">
              {getFieldDecorator('user_name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your User Name!',
                  },
                ],
              })(<Input placeholder="Please enter User Name" />)}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input placeholder="Please enter Email" />)}
        </Form.Item>

        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password allowClear placeholder="Please enter password" />)}
        </Form.Item>
        {getFieldDecorator('image', {
          rules: [{ required: true, message: 'Please Select Image' }],
        })(
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={this.beforeUpload}
            onChange={this.uploadImage}
          >
            {imgurl ? <img src={imgurl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        )}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Gender">
              {getFieldDecorator('gender', {
                rules: [{ required: true, message: 'Please input your gender!' }],
              })(<Select defaultValue="male" style={{ width: 120 }} >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Who Am I">
              {getFieldDecorator('designation', {
                rules: [{ required: true, message: 'Please input who ypu are!' }],
              })(<Select defaultValue="male" style={{ width: 120 }} >
                <Option value="student">Student</Option>
                <Option value="teacher">Teacher</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Date of Birth">
              {getFieldDecorator('dob', {
                rules: [{ required: true, message: 'Please Select DOB' }],
              })(
                <DatePicker defaultValue={moment('2015-01-01', 'YYYY-MM-DD')} format='YYYY-MM-DD' />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Next
          </Button>

      </Form>

    );
  }
}
export const WrappedSignin = Form.create({ name: 'register' })(withRouter(Signin));
