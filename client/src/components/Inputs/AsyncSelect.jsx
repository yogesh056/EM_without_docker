import React, { Component } from 'react'
import { Select, Spin } from 'antd';
import API from "../../middleware/api"

const { Option } = Select;

export default class AsyncSelect extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.state = {
      options: [],
      value: [],
      fetching: false,
      selectedItems: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.getValues()
        return true;
    } else return false;
}
componentDidMount()
{
  this.getValues()
}
getValues = async()=> {
   const {api,custom}=this.props
   const {options}=this.state
    // this.lastFetchId += 1;
    // const fetchId = this.lastFetchId;
    this.setState({ options: [], fetching: true });
    let valueRes = await API.get(`/${api}`)
    console.log('fetching details',valueRes,this.props)
    valueRes.data.response.map(value => {
          options.push(custom?(value[`${this.props.customValue}`]):`${value.name}`)
        });
    this.setState({ options, fetching: false });
  };

  // handleChange = value => {
  //   this.setState({
  //     value,
  //     options: [],
  //     fetching: false,
  //   });
  // };
  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };


  render() {
    const { selectedItems,options} = this.state;
    const filteredOptions = options.filter(o => !selectedItems.includes(o)); 
    const { placeholder } = this.props;

    return (
      <Select
      mode="multiple"
      placeholder={placeholder}
      value={selectedItems}
      onChange={this.handleChange}
      style={{ width: '100%' }}
    >
      {filteredOptions.map(item => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
    );
  }
}

