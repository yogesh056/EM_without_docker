import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Routes from './Routes';
// import MomentUtils from '@date-io/moment';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
	
				<div className="App">
					<Routes />
				</div>
		);
	}
}

export default hot(App);
