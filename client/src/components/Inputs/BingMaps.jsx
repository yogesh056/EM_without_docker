import React, { Component } from 'react';
import { ReactBingmaps } from 'react-bingmaps'
export default class BingMaps extends React.Component {
  state = {
    coordinates: [],
    pushPins : [
      {
        "location":[13.083620071411133, 80.28251647949219], "option":{ color: 'red' }, "addHandler": {"type" : "click", callback: this.callBackMethod }
      }
    ],
  };
  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.init()
        return true;
    } else return false;
}
componentDidMount()
{
  this.init()
}
  init=()=>
  {
    const{coordinates,pushPins,needPushPin}=this.props
    this.setState({coordinates,pushPins,needPushPin})
  }
  render() {
    const{coordinates,pushPins}=this.state
    return (
     <ReactBingmaps
      zoom={15}
      center={coordinates}
      bingmapKey="ApGY9gsUaE91wBdQ062p4KyTF3Tw5KNNmy8-ZweLiLI0QPhlVjM40gGYF_L5ju4e"
      pushPins = {pushPins}
    >
    </ReactBingmaps>
    )
  }
}

