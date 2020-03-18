import { Skeleton,Descriptions, Row, Col, Statistic, List, Avatar, Icon, Tooltip, Button, Progress, message, Typography, Tag, Divider, Card } from 'antd';
import React from 'react';
import { EyeOutlined, LikeOutlined } from '@ant-design/icons';
import API from "../../middleware/api"
import Auth from '../../auth/ProtectedRoute';
import {WrappedFilter} from "../../components/Form/FilterForm"
import moment from "moment"
const { Text } = Typography;
const { Meta } = Card;
const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);
export default class Events extends React.Component {
  state = {
    eventLoading: true,
    visible: false,
    report: true,
    likes: 123,
    name: "hello"
  };
  componentWillMount() {
    this.getAllEvents()
    setTimeout(async () => {
      let userDetail = await Auth.getUserDetails()
      console.log("User in Events", userDetail)
      if (userDetail) {
        this.setState({ userDetail })
      }
    }, 1000)
  }
  getAllEvents = async () => {
    let response = await API.get('/events/getEvents')
    response.data.code === 200 ? message.success(response.data.msg, 4) : message.error(response.data.msg, 4);
    console.log("res", response.data.response)

    this.setState({ events: response.data.response, eventLoading: false })

  }
  onChange = checked => {
    this.setState({ loading: !checked });
  };
  showModal = (item) => {
    this.setState({
      visible: true,
      eventDetails: item,
      eventSelected: true
    }, () => {
      console.log("Event selected", this.state)
    }
    );

  };
  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };
  changeReport=()=>
  {
      this.setState({report:!this.state.report})
      setTimeout( () => {
        this.setState({report:!this.state.report})
    }, 3000)
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };
  gotoLink = (link) => {
    this.props.history.push(link)
  }
  render() {
    const { eventLoading, events, } = this.state;

    return (
      [
        <Button type="primary" onClick={()=>this.gotoLink('/add-event')} style={{ float: 'right' }}>
          <Icon type="plus" /> New Event
        </Button>,
        <div className="events-wrap">
 <List
          itemLayout="horizontal"
          style={{ margin: '0 150px', width: 600 }}
          dataSource={events}
          renderItem={item => (
            <List.Item >
              <Skeleton loading={eventLoading} active avatar>
                <Card
                  className="card-event"
                  onClick={() =>this.gotoLink(`/event/${item.id}`)}
                  title={<Meta
                    avatar={<Avatar src={item.user.image} />}
                    title={item.user.user_name}
                    description={moment(item.createdAt).fromNow()}
                  />}
                  style={{ width: 600, cursor: "pointer" }}
                >
                  <Card
                    style={{ width: 552 }}
                    className="main-wrap-card"
                    cover={
                      <img
                        alt="example"
                        src={item.image}
                      />
                    }
                  >
                    <Descriptions title={item.name}>
                      <Descriptions.Item label="Description">{item.description}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                  <Row gutter={16}>
                    <Col span={11} style={{ textAlign: "center", margin: "5px" }}>
                      <Statistic valueStyle={{ fontSize: "20px" }} title="Feedback" value={item.comments.length} prefix={<LikeOutlined />} />
                    </Col>
                    <Col span={11} style={{ textAlign: "center", margin: "5px" }}>
                      <Statistic valueStyle={{ fontSize: "20px" }} title="Views" value={item.views} prefix={<EyeOutlined />} />
                    </Col>
                  </Row>
                </Card>
              </Skeleton>
            </List.Item>
          )}
        />
        <div className="events-filter">
          <WrappedFilter/>
        </div>
        </div>
       
      ]
    );
  }
}

