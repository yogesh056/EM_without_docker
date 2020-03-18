import { Skeleton, Switch, List, Avatar, Icon, Tooltip, Progress, message, Typography, Tag, Divider, Card } from 'antd';
import React from 'react';
import {AddArticle } from './AddArticle'
import API from "../../middleware/api"
import Auth from '../../auth/ProtectedRoute';
import moment from "moment"
const { Text } = Typography;
const { Meta } = Card;
export default class Article extends React.Component {
  state = {
    eventLoading: true,
    visible: false,
    likes: 123,
    name: "hello"
  };
  componentWillMount() {
    this.getAllEvents()
    setTimeout(async() => {
      let userDetail=await Auth.getUserDetails()
      console.log("User in Events",userDetail)
      if (userDetail) {
        this.setState({userDetail})
      }
    },1000)
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
      eventDetails:item,
      eventSelected:true
    },()=>
    {
      console.log("Event selected",this.state)
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

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };
  render() {
    const { eventLoading, visible, events,eventDetails,userDetail,eventSelected} = this.state;

    return (
      [<AddArticle/>,
      <List
        itemLayout="horizontal"
        style={{margin:'0 auto', width: 600}}
        dataSource={events}
        renderItem={item => (
          <List.Item>
          
            <Skeleton loading={eventLoading} active avatar>
              <Card
                className="card-event"
                onClick={()=>this.showModal(item)}
                title={<Meta
                  avatar={<Avatar src={item.user.image} />}
                  title={item.user.user_name}
                  description={moment(item.createdAt).fromNow()}
                />}
                style={{ width: 600 ,cursor:"pointer" }}
              >
                <Card
                  style={{ width: 552 }}
                  className="main-wrap-card"
                  cover={
                    <img
                      alt="example"
                      src={item.images}
                    />
                  }
                >
                  <Meta
                    // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={item.name}
                    description={item.description}
                  />

                    <Progress percent={30} size="small" />
                </Card>
              </Card>
            </Skeleton>
          </List.Item>
          )}
      />,
      ]
    );
  }
}

