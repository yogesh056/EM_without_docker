import React, { Component } from 'react'
import {Form, Col, Row, Input, Select, DatePicker, Icon, message, Upload, Button } from 'antd';
import { storage } from '../../firebase/index';
import API from "../../middleware/api"
import Auth from "../../auth/ProtectedRoute"
const { Option } = Select;

class ForumForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      loading: false,
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
  componentWillMount() {
    this.getUserDetail()
  }
  getUserDetail = async () => {
    let userDetail = await Auth.getUserDetails()
    console.log("User in Events", userDetail)
    if (userDetail) {
      this.setState({ userDetail })
    }
  }
  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.getUserDetail()
      return true;
    } else return false;
  }
  gotoLink = (link) => {
    this.props.history.push(link)
  }
  handleSubmit = e => {
    let { userDetail,imgurl} = this.state
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let response
        try {
          console.log("req",values)
          response = await API.post('/questions/addQuestion', {
            userId:parseInt(userDetail.id),
            description: values.description,
            cateogory: values.cateogory,
            image: imgurl,
          })
          console.log(response)
          message.success(response.data.msg, 4);
          this.gotoLink('/forum')

        }
        catch (e) {
          console.log(e)
          message.error(e.msg, 4);
        }

      }

    });
   
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, imgurl } = this.state
    const uploadButton = (
      <div>
        {loading ? <Icon type="loading" /> : <Icon type="plus" />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="event-form" style={{ margin: '0 auto', width: 700 }}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="Cateogory">
                {getFieldDecorator('cateogory', {
                  rules: [{ required: true, message: 'Please enter cateogory' }],
                })(<Input placeholder="Please enter cateogory" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item label="Upload ScreenShot">
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
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item label="Description">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: 'please enter  description',
                    },
                  ],
                })(<Input.TextArea rows={4} placeholder="please enter description" />)}
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            Submit
            </Button>
        </Form>
        {/* </Drawer> */}
      </div>
    );
  }
}

export const AddForum = Form.create()(ForumForm);
