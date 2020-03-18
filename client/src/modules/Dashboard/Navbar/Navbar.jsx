
import React, { Component, Fragment } from "react";
import 'antd/dist/antd.css';
import { Menu, Icon, Avatar, Badge,Tag } from 'antd';
import "./Navbar.css"
import { GithubOutlined } from '@ant-design/icons';
import { Redirect, withRouter } from "react-router-dom";
import {
  Link
} from "react-router-dom";
import API from '../../../middleware/api';
import Auth from "../../../auth/ProtectedRoute";

const { SubMenu } = Menu;
// import { WrappedLogin } from '../Login/Login'
class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      current: 'mail',
      isLogged: false
    };
  }
  componentWillMount() {
    setTimeout(async () => {
      let userDetail = await Auth.getUserDetails()
      console.log("User Navbar", userDetail)
      if (userDetail) {
        this.setState({ isLogged: true, userDetail }, () => { console.log("123", this.state) })
      }
    }, 1000)
  }
  logOut = () => {
    localStorage.removeItem("user_id");
    Auth.signout()
    this.props.history.push('/login')

  }
  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    }, () => {
      console.log(this.state)
    });
  };
  conditionalRender() {
    const { userDetail, isLogged } = this.state
    if (isLogged)
      return (

        [<Menu.Item>
        <GithubOutlined style={{fontSize:"20px"}} onClick={()=>  this.props.history.push('/git')}/>
             </Menu.Item>,
        <Menu.Item>
          <Badge dot>
            <Icon type="notification" />
          </Badge>
        </Menu.Item>,
        <Menu.Item>
          <Badge dot>
            <Icon type="message" />
          </Badge>
        </Menu.Item>,
        <SubMenu
          title={
            <Avatar src={userDetail.image} />
          }
        >
          <Menu.ItemGroup title={userDetail.user_name}>
            <Menu.Item key="settings">Settings</Menu.Item>
          </Menu.ItemGroup>
          <Menu.Item key="logout" onClick={this.logOut}>Logout</Menu.Item>
        </SubMenu>,
        ]
      )
  }
  // selectedKeys={[this.state.current]} 
  render() {

    return (
      [
              //  <Avatar style={{width:'100px',height:'40px'}} src="https://www.freelogodesign.org/file/app/client/thumb/4b5eae33-aeac-4f89-bd85-cf79eaab3009_200x200.png?1583909862213" />,
      <Menu onClick={this.handleClick} mode="horizontal">
       
      
        {this.conditionalRender()}
      

      </Menu>]
    )
  }
}
export default withRouter(Navbar);