import React from 'react';
import { Comment, Form, Button, Input, Modal } from 'antd';
import Mention from "../../components/Inputs/Mention"
import moment from 'moment';
import API from "../../middleware/api"
import { ReactBingmaps } from 'react-bingmaps'
import "../Events/Events.css"
import Auth from "../../auth/ProtectedRoute"
import { Descriptions, Badge, List, Row, Col, Statistic,Popconfirm, Avatar, Icon, Tooltip, message, Tag, Divider, Card, Empty } from 'antd';
import { EyeOutlined, LikeOutlined } from '@ant-design/icons';
const { Meta } = Card;
export default class SingleEventPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            submitting: false,
            value: '',
            pushPins: [
                {
                    "location": [13.083620071411133, 80.28251647949219], "option": { color: 'red' }, "addHandler": { "type": "click", callback: this.callBackMethod }
                }
            ],
        };
    }
    componentWillMount() {
        console.log("props", this.props, this.props.match.params.id)
        this.getUserDetail()
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
            console.log("props", this.props)
            this.getUserDetail()
            this.eventUpdate()
            return true;
        } else return false;
    }
    getUserDetail = async () => {
        let userDetail = await Auth.getUserDetails()
        console.log("User in Events", userDetail)
        if (userDetail) {
            this.setState({ userDetail }, () =>
                this.eventUpdate())
        }
    }
    eventUpdate = async () => {
        let { userDetail } = this.state
        let eventRes = await API.post('/events/getEvent', { event_id: this.props.match.params.id, user_id: userDetail.id })
        this.setState({
            comments: eventRes.data.comments, eventDetails: eventRes.data.eventDetails, upVote: eventRes.data.upVote, downVote: eventRes.data.downVote, eventLoading: false, voteBool: eventRes.data.voteBool,report:eventRes.data.report,pushPins: [...this.state.pushPins, {
                "location": eventRes.data.eventDetails.geoLocation, "option": { color: 'blue' }, "addHandler": { "type": "click", callback: this.callBackMethod }
            }]
        }, () => {
            console.log("Current Event", this.state)
        })

    }
    likeFunc = async (voteBool) => {
        let { userDetail } = this.state

        let res = await API.post('/events/vote', { event_id: this.props.match.params.id, user_id: userDetail.id, vote_bool: voteBool })
        this.eventUpdate()
    }
    handleSubmit = async () => {
        let { userDetail, value } = this.state
        if (!this.state.value) {
            return;
        }
        this.setState({
            submitting: true,
        });
        let response = await API.post('/events/addComment', { event_id: this.props.match.params.id, user_id: userDetail.id, comment: value })
        response.data.code === 200 ? message.success(response.data.msg, 4) : message.error(response.data.msg, 4);
        this.eventUpdate()
        setTimeout(() => {
            this.setState({
                value:'',
                submitting: false,
            });
        }, 1000);
    };
    deleteComment = async (id) => {
        let response = await API.post('/events/deleteComment', { event_id: this.props.match.params.id, comment_id: id })
        this.eventUpdate()
    }

    handleChange = e => {
        this.setState({ value: e })

    };
    onSelect = (e) => {
        console.log("se", e)
    }
    render() {
        const { comments, report, value, downVote, upVote, voteBool, eventDetails, userDetail } = this.state;
        return (
            [eventDetails && <div className="event-single-wrap">
                <div className="event-single-info">
                    <Card
                        title={<Meta
                            avatar={<Avatar src={eventDetails.user.image} />}
                            title={eventDetails.user.user_name}
                            description={moment(eventDetails.createdAt).fromNow()}
                        />}
                        style={{ width: "600px", margin: "0 auto" }}
                    >

                        <Card
                            style={{ width: "552px" }}
                            className="main-wrap-card"
                            cover={
                                <img
                                    alt="example"
                                    src={eventDetails.image}
                                />
                            }
                            actions={[
                                <span key="comment-basic-like" style={{ color: voteBool === "liked" ? "cornflowerblue" : "" }} onClick={() => this.likeFunc(true)}>
                                    <Tooltip title="Like">
                                        <Icon type="like-o" key="skeleton-star-o" />
                                    </Tooltip>
                                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>{upVote}</span>
                                </span>,
                                <span key="comment-basic-like" style={{ color: voteBool === "disliked" ? "cornflowerblue" : "" }} onClick={() => this.likeFunc(false)}>
                                    <Tooltip title="DisLike">
                                        <Icon type="dislike-o" key="skeleton-like-o" />
                                    </Tooltip>
                                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>{downVote}</span>
                                </span>,
                                <span key="comment-basic-like" >
                                    <Tooltip title="Share">
                                        <Icon type="share-alt" />
                                    </Tooltip>
                                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>{"Share"}</span>
                                </span>,
                            ]}
                        >
                            <Descriptions title={eventDetails.name}>
                                <Descriptions.Item label="Description">{eventDetails.description}</Descriptions.Item>
                            </Descriptions>
                            <Row gutter={16}>
                                <Col span={7} style={{ textAlign: "center", margin: "5px" }}>
                                    <Statistic valueStyle={{ fontSize: "20px" }} title="Feedback" value={comments.length} prefix={<LikeOutlined />} />
                                </Col>
                                <Col span={7} style={{ textAlign: "center", margin: "5px" }}>
                                    <Statistic valueStyle={{ fontSize: "20px" }} title="Views" value={eventDetails.views} prefix={<EyeOutlined />} />
                                </Col>

                                <Col span={7} style={{ textAlign: "center", margin: "5px" }}>
                                    <Statistic valueStyle={{ fontSize: "20px" }} title="Report" value={report*100} suffix="/ 100" />
                                </Col>

                            </Row>
                        </Card>
                    </Card>
                    <Descriptions title="User Info" bordered column={2}>
                        <Descriptions.Item label="Cateogory">
                            <Tag color="magenta">{eventDetails.cateogory}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">{eventDetails.start_date}</Descriptions.Item>
                        <Descriptions.Item label="District">{eventDetails.district}</Descriptions.Item>
                        <Descriptions.Item label="Locality">{eventDetails.locality}</Descriptions.Item>
                        <Descriptions.Item label="URL" span={3}>
                            <Badge status="processing" /><Button type="link" size='small'>{eventDetails.url} </Button>
                        </Descriptions.Item>
                        <Descriptions.Item label="Location" span={3}>
                            <ReactBingmaps
                                center={eventDetails.geoLocation}
                                bingmapKey="ApGY9gsUaE91wBdQ062p4KyTF3Tw5KNNmy8-ZweLiLI0QPhlVjM40gGYF_L5ju4e"
                                pushPins={this.state.pushPins}
                            >
                            </ReactBingmaps>
                            <div className="direction-container">
                                <div className="input-panel" id='inputPanel'></div>
                                <div className="itinerary-container" id='itineraryContainer'></div>
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
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
                                <Icon type="message" key="skeleton-message" /> Add Comment
                                    </Button>
                        </div>
                    }
                />}
                {
                    comments.length > 0 ?
                        <List
                            dataSource={comments}
                            header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
                            itemLayout="horizontal"
                            renderItem={item =>
                                item.author ? <></> :
                                    <List.Item>
                                        <Comment
                                            style={{ width: "100%" }}
                                            author={item.user.user_name}
                                            avatar={
                                                <Avatar
                                                    src={item.user.image}
                                                    alt={item.user.user_name}
                                                />
                                            }
                                            content={
                                                <p>
                                                    {item.comment}
                                                </p>
                                            }
                                            datetime={
                                                <Tooltip >
                                                    <span>{moment(item.createdAt).fromNow()}</span>
                                                </Tooltip>
                                            }
                                        />
                                        <span style={{ color: "red", fontSize: "14px", cursor: "pointer" }}>
                                            {item.user.id === userDetail.id ?
                                                <Popconfirm
                                                    title="Are you sure delete this task?"
                                                    onConfirm={() => this.deleteComment(item.id)}
                                                    onCancel={()=>{console.log("cancel")}}
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