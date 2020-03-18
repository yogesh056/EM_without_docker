import React from 'react';
import { Comment, Form, Button, List, Popconfirm, Avatar, Card } from 'antd';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled,CaretUpOutlined,CaretDownOutlined } from '@ant-design/icons';
import Mention from "../../components/Inputs/Mention"
import moment from 'moment';
import API from "../../middleware/api"
import { ReactBingmaps } from 'react-bingmaps'
import "../Events/Events.css"
import Auth from "../../auth/ProtectedRoute"
import { Typography, Icon, Tooltip, message, Tag, Divider, Empty } from 'antd';
const { Meta } = Card;
const { Text } = Typography;
const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);

export default class SingleEventPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            submitting: false,
            value: '',
            action: null,
        };
    }
    componentWillMount() {
        this.getUserDetail()
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
            this.getUserDetail()
            this.questionUpdate()
            return true;
        } else return false;
    }
    getUserDetail = async () => {
        let userDetail = await Auth.getUserDetails()
        if (userDetail) {
            this.setState({ userDetail }, () =>
                this.questionUpdate())
        }
    }
    vote = async (voteBool,id) => {
        let { userDetail } = this.state
        let res = await API.post('/questions/vote', { answer_id: id, user_id: userDetail.id, vote_bool: voteBool })
        this.questionUpdate()
    }
    questionUpdate = async () => {
        let { userDetail } = this.state
        let questionRes = await API.post('/questions/getQuestion', { question_id: this.props.match.params.id, user_id: userDetail.id })
        this.setState({
            answers: questionRes.data.answers, questionDetails: questionRes.data.questionDetails
        }, () => {
            console.log("Current Question", this.state)
        })

    }
    likeFunc = async (voteBool) => {
        let { userDetail } = this.state

        let res = await API.post('/events/vote', { event_id: this.props.match.params.id, user_id: userDetail.id, vote_bool: voteBool })
        this.questionUpdate()
    }
    handleSubmit = async () => {
        let { userDetail, value } = this.state
        if (!this.state.value) {
            return;
        }
        this.setState({
            submitting: true,
        });
        let response = await API.post('/questions/addAnswer', { question_id: this.props.match.params.id, user_id: userDetail.id, answer: value })
        response.data.code === 200 ? message.success(response.data.msg, 4) : message.error(response.data.msg, 4);
        this.questionUpdate()
        setTimeout(() => {
            this.setState({
                value: '',
                submitting: false,
            });
        }, 1000);
    };
    deleteComment = async (id) => {
        let response = await API.post('/events/deleteComment', { event_id: this.props.match.params.id, comment_id: id })
        this.questionUpdate()
    }

    handleChange = e => {
        this.setState({ value: e })

    };
    onSelect = (e) => {
        console.log("se", e)
    }
    render() {
        const { answers, value, questionDetails, userDetail, action } = this.state;
        return (
            [questionDetails && <div className="event-single-wrap">
                <div className="event-single-info">
                    <List
                        itemLayout="vertical"
                        size="large"
                        style={{ margin: '0 auto', width: '100%' }}
                        dataSource={questionDetails}
                        renderItem={item => (
                            <List.Item
                                key={item.cateogory}
                                style={{ margin: "10px 0px" }}
                                onClick={() => this.gotoLink(`/question/${item.id}`)}
                                actions={
                                    [
                                        <IconText type="star-o" text='97' key="skeleton-star-o" />,
                                        <IconText type="message" text={answers.length} key="skeleton-message" />,
                                    ]
                                }
                                extra={
                                    (
                                        <img
                                            style={{ height: '100%', width: '300px' }}
                                            alt="logo"
                                            src={item.image ? item.image : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
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
                    />
                </div>
                {userDetail && <Comment
                    avatar={
                        <Avatar
                            src={userDetail.image}
                            alt={userDetail.user_name}
                        />
                    }
                    content={
                        <div  >
                            <Form.Item>
                                <Mention api="users/allUsers" custom={true} customValue="first_name" rows={4} onChange={this.handleChange} onSelect={this.onSelect} value={value} rows="3" />
                            </Form.Item>

                            <Button onClick={this.handleSubmit} type="primary">
                                <Icon type="message" key="skeleton-message" /> Add Answer
                                    </Button>
                        </div>
                    }
                />}
                {
                    answers.length > 0 ?
                        <List
                            dataSource={answers}
                            header={`${answers.length} ${answers.length > 1 ? 'answers' : 'answer'}`}
                            itemLayout="horizontal"
                            renderItem={item =>
                                item.author ? <></> :
                                    <List.Item>
                                        <div style={{display:"flex",flexDirection:'column'}}>
                                            <CaretUpOutlined style={{fontSize:'25px'}} onClick={()=>this.vote(true,item.id)}/>
                                            <span  style={{padding:'10px'}}>
                                              {item.vote}
                                            </span>
                                            <CaretDownOutlined style={{fontSize:'25px'}} onClick={()=>this.vote(false,item.id)}/>
                                        </div>
                                        <Comment
                                        style={{margin:"0px 40px", width:"100%"}}
                                            author={item.user.user_name}
                                            avatar={
                                                <Avatar
                                                    src={item.user.image}
                                                    alt={item.user.user_name}
                                                />
                                            }
                                            content={
                                                <p>
                                                    {item.description}
                                                </p>
                                            }
                                            datetime={
                                                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                    <span>{moment(item.createdAt).fromNow()}</span>
                                                </Tooltip>
                                            }
                                        />
                                        <span style={{ color: "red", fontSize: "14px", cursor: "pointer" }}>
                                            {item.user.id === userDetail.id ?
                                                <Popconfirm
                                                    title="Are you sure delete this task?"
                                                    onConfirm={() => this.deleteComment(item.id)}
                                                    onCancel={() => { console.log("cancel") }}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Icon type="delete" />
                                                </Popconfirm> : ""}
                                        </span>

                                    </List.Item>
                            }
                        /> : <Empty description={"No Comments"} />
                }
            </div >
            ]);
    }
}