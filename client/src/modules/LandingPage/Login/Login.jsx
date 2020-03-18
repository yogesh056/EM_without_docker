import { Form,Drawer, Icon, Input,Row,Col, Button, Checkbox ,message,Layout} from 'antd';
import React from 'react';
import {login} from "../../../middleware/users"
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import API from '../../../middleware/api';
import Auth from '../../../auth/ProtectedRoute';

const { Header, Content } = Layout;
class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state={

    }
  }
  responseGoogle = async(googleLogin) => {
    let response= googleLogin.profileObj
   
                  try{
                      response = await API.post('/users/signin',
                      {
                          "first_name": response.givenName,
                          "last_name": response.familyName,
                          "user_name": response.givenName,
                          "password":"googleLogin",
                          "email": response.email,
                          "phone":null,
                          "dob": null,
                          "designation":null,
                          "gender":"",
                          "image": response.imageUrl,
                      })
                      response.data.code===200?message.success(response.data.msg,4): message.error(response.data.msg,4); 
                      localStorage.setItem("user_id",response.data.user_id)
                      Auth.authenticate()
                      this.props.history.push('/')
                    }
                    catch(e)
                    {
                      console.log(e)
                    }
  
  }
  handleSubmit =  (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        console.log(values.email,values)
        let response = await API.post('/users/login',{
          email:values.email,
          password:values.password
        })
        if(response.data.code===200)
        {
        Auth.authenticate()
        this.props.history.push('/')
        console.log(response)
        localStorage.setItem("user_id",response.data.id)
        }
        message.success(response.data.msg, 5);
      }
    });
  };

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout>
                <Header style={{ background: '#fff', padding: '50px 100px' }}>
                    
                </Header>
                <Layout style={{ background: '#ffffff' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: ' 0 auto', minHeight: 280,width:'400px' }}>


      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
        <Button type="primary" htmlType="submit"  block>
            Log in
          </Button>
         
       or <Link to="/signin">register now!</Link>
  
        </Form.Item>
        <Form.Item>
        <GoogleLogin
    clientId="335076764870-kt05hkuptqi7g2qmsoqnvk96oivcslrj.apps.googleusercontent.com"
    render={renderProps => (
       <Button type="link" onClick={renderProps.onClick} block>
       <Icon type="google" /> Login with Google
       </Button>
    )}
    buttonText="Login"
    onSuccess={this.responseGoogle}
    onFailure={this.responseGoogle}
    cookiePolicy={'single_host_origin'}
  />,
       
        </Form.Item>
      </Form>
                    </Content>
                </Layout>
            </Layout >
     
    );
  }
}

export const WrappedLogin = Form.create({ name: 'normal_login' })(withRouter(Login));