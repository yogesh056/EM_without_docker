import { Steps, Button, message, Icon, Layout } from 'antd';
import { WrappedSignin } from '../Signin/Signin';
import { WrappedVerifyMail } from '../Signin/VerifyMail';
import React, { Component } from 'react';
const { Step } = Steps;
const { Header, Content, Footer, Sider } = Layout;

const steps = [
    {
        title: 'Login',
        icon: <Icon type="user" />
    },
    {
        title: 'Verification',
        icon: <Icon type="solution" />
    }
];
export default class Stepper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
        };
    }

    next=(value)=> {
        console.log(this.state)
        const currentTab = this.state.currentTab + 1;
        // this.wrappedSignin.current.onSubmit();
        this.setState({ currentTab,value });
    }

    previous=()=> {
        const currentTab = this.state.currentTab - 1;
        this.setState({ currentTab });
    }

    render() {
        const { currentTab } = this.state;
        return (
            <Layout>
                <Header style={{ background: '#fff', padding: '50px 100px' }}>
                    <Steps current={currentTab}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} icon={item.icon} />
                        ))}
                    </Steps>
                </Header>
                <Layout style={{ background: '#ffffff' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: ' 0 auto', minHeight: 280, }}>

                        <div className="steps-content">{
                            currentTab === 0 ? <WrappedSignin next={this.next} /> : <WrappedVerifyMail value={this.state.value} previous={this.previous}/>
                        }
                        </div>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}
