import React, { Component } from 'react'
import { Select } from 'antd';
import jsonp from 'fetch-jsonp';
import querystring from 'querystring';

const { Option } = Select;

export default class SearchInput extends React.Component {
  state = {
    data: []
  };
  getResults = (querystring) => {
    this.setState({ data: [] });
    fetch(`http://dev.virtualearth.net/REST/v1/Autosuggest?query=${querystring}&userRegion=IN&maxResults=10&countryFilter=IN&includeEntityTypes=Place&key=AhfxtU5ERbIsHxq2GUPqlWekK1bZf51RdG8zatOvy9C9O6_z0jSrPOLGWxNMtqXx`)
      .then(res => res.json())
      .then(result => {
        result.resourceSets[0].resources[0].value.map((r, index) => {
          this.setState({
            data: [...this.state.data, {
              value: r.name ? r.name : r.address.locality,
              text: index,
            }]
          }, () => {
            console.log(this.state)
          });
        });
      })
    fetch(`http://dev.virtualearth.net/REST/v1/Locations?q=${querystring}&key=ApGY9gsUaE91wBdQ062p4KyTF3Tw5KNNmy8-ZweLiLI0QPhlVjM40gGYF_L5ju4e`)
      .then(res => res.json())
      .then(result => {
        let lat = result.resourceSets[0].resources[0].point.coordinates[0]
        let long = result.resourceSets[0].resources[0].point.coordinates[1]
        this.setState({ lat, long })
      })
  }
  handleSearch = value => {
    if (value) {
      let querystring = value.replace(/\s+/g, '%20').toLowerCase();
      console.log("---", querystring)
      this.getResults(querystring)
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const options = this.state.data.map((d, index) => <Option key={index}>{d.value}</Option>);
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

