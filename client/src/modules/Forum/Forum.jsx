import { Skeleton, Button, List, Avatar, Icon,message,Typography } from 'antd';
import React, { Component } from 'react'
import API from "../../middleware/api"
import Auth from '../../auth/ProtectedRoute';
import moment from "moment"
const { Text } = Typography;
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export default class Forum extends React.Component {
  state = {
    questionLoading: true,
  };
  componentWillMount() {
    this.getAllQuestions()
    setTimeout(async () => {
      let userDetail = await Auth.getUserDetails()
      console.log("User in Events", userDetail)
      if (userDetail) {
        this.setState({ userDetail })
      }
    }, 1000)
  }
  getAllQuestions = async () => {
    let response = await API.get('/questions/getQuestions')
    response.data.code === 200 ? message.success(response.data.msg, 4) : message.error(response.data.msg, 4);
    console.log("res", response.data.response)

    this.setState({ questions: response.data.response, questionLoading: false })

  }
  onChange = checked => {
    this.setState({ loading: !checked });
  };
  gotoLink = (link) => {
    this.props.history.push(link)
  }
  render() {
    const {questions,questionLoading} = this.state;

    return (
      [<Button type="primary" onClick={() => this.gotoLink('/add-question')} style={{ float: 'right' }}>
        <Icon type="plus" /> New Question
  </Button>,
      <List
        itemLayout="vertical"
        size="large"
        style={{ margin: '0 auto', width: 800 }}
        dataSource={questions}
        renderItem={item => (
          <List.Item
            key={item.name}
            style={{ margin: "10px 0px" }}
            onClick={()=>this.gotoLink(`/question/${item.id}`)}
            actions={
              !questionLoading && [
                <IconText type="star-o" text="156" key="skeleton-star-o" />,
                <IconText type="message" text="2" key="skeleton-message" />,
              ]
            }
            extra={
              !questionLoading && (
                <img
                  style={{height:'100%',width:'300px'}}
                  alt="logo"
                  src={item.image?item.image:"https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
                />
              )
            }
          >
              <List.Item.Meta
                 avatar={<Avatar src={item.user.image} />}
                    title={item.user.user_name}
                    description={moment(item.createdAt).fromNow()}
              />
              <Text mark>{item.cateogory}</Text>
              <div>
              {item.description}
              </div>
          </List.Item>
        )}
      />]
    );
  }
}