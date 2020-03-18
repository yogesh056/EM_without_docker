import React, { Component } from 'react'
import { Drawer, Form, Col, Row, Input, Select, DatePicker, Icon, message, Upload, Button } from 'antd';
import { storage } from '../../firebase/index';
import API from "../../middleware/api"
import moment from 'moment';
import Auth from "../../auth/ProtectedRoute"
import BingMaps from "../../components/Inputs/BingMaps"
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const selectBefore = (
  <Select defaultValue="http://" style={{ width: 90 }}>
    <Option value="http://">http://</Option>
    <Option value="https://">https://</Option>
  </Select>
);

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      loading: false,
      data: [],
      coordinates: [],
      pushPins: [
        {
          "location": [13.083620071411133, 80.28251647949219], "option": { color: 'red' }, "addHandler": { "type": "click", callback: this.callBackMethod }
        }
      ],
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
  handleSubmit = e => {
    let { userDetail, address,coordinates,imgurl} = this.state
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let response
        try {
          console.log("req",values)
          response = await API.post('/events/addEvent', {
            userId:parseInt(userDetail.id),
            name: values.name,
            description: values.description,
            url: values.url,
            views:0,
            cateogory: values.cateogory,
            geoLocation:coordinates,
            image: imgurl,
            district: address.adminDistrict2,
            locality: address.locality,
            state: address.adminDistrict,
            start_date: values.start_date
          })
          console.log(response)
          message.success(response.data.msg, 4);
          this.gotoLink('/events')

        }
        catch (e) {
          console.log(e)
          message.error(e.msg, 4);
        }

      }

    });
    // handleConfirmBlur = e => {
    //   const { value } = e.target;
    //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // };
  };
  gotoLink = (link) => {
    this.props.history.push(link)
  }
  getResults = (querystring) => {
    this.setState({ data: [] });
    fetch(`http://dev.virtualearth.net/REST/v1/Autosuggest?query=${querystring}&userRegion=IN&maxResults=10&countryFilter=IN&includeEntityTypes=Place&key=AhfxtU5ERbIsHxq2GUPqlWekK1bZf51RdG8zatOvy9C9O6_z0jSrPOLGWxNMtqXx`)
      .then(res => res.json())
      .then(result => {
        result.resourceSets[0].resources[0].value.map((r, index) => {
          this.setState({
            data: [...this.state.data, {
              value: r.name ? r.name : r.address.locality,
              text: index,
            }]
          }, () => {
            console.log(this.state)
          });
        });
      })

  }
  handleSearch = value => {
    if (value) {
      let querystring = value.replace(/\s+/g, '%20').toLowerCase();
      console.log("---", querystring)
      this.getResults(querystring)
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = value => {
    this.setState({ value });
  };
  handleSelect = value => {
    let { data, pushPins } = this.state
    fetch(`http://dev.virtualearth.net/REST/v1/Locations?q=${data[value].value}&key=ApGY9gsUaE91wBdQ062p4KyTF3Tw5KNNmy8-ZweLiLI0QPhlVjM40gGYF_L5ju4e`)
      .then(res => res.json())
      .then(result => {
        let coordinates = result.resourceSets[0].resources[0] ? result.resourceSets[0].resources[0].point.coordinates : []
        let address = result.resourceSets[0].resources[0] ? result.resourceSets[0].resources[0].address : ''
        pushPins[0]['location'] = coordinates
        this.setState({
          coordinates, locality: data[value].value, address, pushPins: [...this.state.pushPins, {
            "location": coordinates, "option": { color: 'blue' }, "addHandler": { "type": "click", callback: this.callBackMethod }
          }]
        }, () => {
          console.log(this.state, "---")
        })
      })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, imgurl, coordinates, pushPins } = this.state
    const uploadButton = (
      <div>
        {loading ? <Icon type="loading" /> : <Icon type="plus" />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const options = this.state.data.map((d, index) => <Option key={index}>{d.value}</Option>);

    return (
      <div className="event-form" style={{ margin: '0 auto', width: 700 }}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please enter user name' }],
                })(<Input placeholder="Please enter user name" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cateogory">
              {getFieldDecorator('cateogory', {
                  rules: [{ required: true, message: 'Please enter cateogory' }],
                })(
                <Select defaultValue="culturals">
                  <Option value="culturals">Culturals</Option>
                  <Option value="technical">Technical</Option>
                  <Option value="sports">Sports</Option>
                  <Option value="others">Others</Option>
                </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="Date of Event">
                {getFieldDecorator('start_date', {
                  rules: [{ required: true, message: 'Please Select DOB' }],
                })(
                  <DatePicker defaultValue={moment('2015-01-01', 'YYYY-MM-DD')} format='YYYY-MM-DD' />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="URL">
                {getFieldDecorator('url', {
                  rules: [{ required: true, message: 'Please Select URL' }],
                })(
                  <Input addonBefore={selectBefore} defaultValue="mysite" />
                )}
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item label="Upload Image">
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
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Form.Item label="Locality">
              {getFieldDecorator('locality', {
                rules: [{ required: true, message: 'Please Select locality' }],
              })(
                <Select
                  showSearch
                  allowClear
                  value={this.state.value}
                  placeholder="Search Locality"
                  style={{ width: 250, padding: "10px" }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.handleSearch}
                  onChange={this.handleChange}
                  notFoundContent={null}
                  onSelect={this.handleSelect}
                >
                  {options}
                </Select>)}
            </Form.Item>
            <BingMaps coordinates={coordinates} pushPins={pushPins} />
          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item label="Description">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ],
                })(<Input.TextArea rows={4} placeholder="please enter url description" />)}
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

export const AddEvent = Form.create()(EventForm);
