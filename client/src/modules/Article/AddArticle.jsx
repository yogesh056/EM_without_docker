import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, message } from 'antd';
import React, { Component } from 'react'
// import AsyncSelect from '../../Inputs/AsyncSelect';
import { storage } from '../../firebase/index';
import API from "../../middleware/api"
import moment from 'moment';
import Auth from "../../auth/ProtectedRoute"
import Quill from '../../components/Inputs/Quill';

const { Option } = Select;

class ArticleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      loading: false,
    };
  }
  
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  uploadImage = (e) => {
    const img = e.target.files[0];
    this.setState(({ img, loading: true }));
    const uploadTask = storage.ref(`images/${img.name}`).put(img);
    uploadTask.on('state_changed', (snapshot) => { },
      (error) => { console.log(error) },
      () => {
        storage.ref('images').child(img.name).getDownloadURL().then(url => {
          console.log('uuu', url)
          this.setState({ imgurl: url, loading: false }, () => {
            console.log('123', this.state.imgurl)
          })

        })
      })
  }
  componentWillMount() {
   
  }
  getUserDetail=async()=>
  {
      let userDetail=await Auth.getUserDetails()
      console.log("User in Events",userDetail)
      if (userDetail) {
        this.setState({userDetail})
      }
  }
  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.getUserDetail()
        return true;
    } else return false;
}
  handleSubmit = e => {
    let {userDetail}=this.state
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.college = 1
        values.city = 2
        values.state = 3
        values.UserId=localStorage.getItem('user_id')
        values.images = this.state.imgurl
        console.log(values)
        
        let response
        try {
          response = await API.post('/events/addEvent', {UserId:userDetail.id, name: values.name, description: values.description, images: values.image, state: values.state, city: values.city, college: values.college, start_date: values.start_date })
          console.log(response)
          message.success(response.data.msg, 4);
          this.onClose()

        }
        catch (e) {
          message.error(e.msg, 4);
        }

      }

    });
    // handleConfirmBlur = e => {
    //   const { value } = e.target;
    //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // };
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer} style={{ float: 'right' }}>
          <Icon type="plus" /> New Article
        </Button>
        <Drawer
          title="Create a new Event"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
        
           <Quill/>
          
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>

          </div>
        </Drawer>
      </div>
    );
  }
}

export const AddArticle = Form.create()(ArticleForm);
