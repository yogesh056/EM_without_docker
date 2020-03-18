/* eslint-disable no-undef */
import axios from 'axios';
import {
    message
  } from 'antd';
const API = axios.create({
	baseURL: "http://localhost:5000/api/"
});

API.interceptors.request.use((config) => {
	// document.getElementById('root-loader').classList.add('visible');
	return config;
});

API.interceptors.response.use(
	(response) => {
		// document.getElementById('root-loader').classList.remove('visible');

		const { code, msg } = response.data;
		if (code === 200 ||code === 400) {
			return response;
		} else {
            throw { ...response, msg };
           
			// throw (`${msg}`);
		}
	},
	(error) => {
		// document.getElementById('root-loader').classList.remove('visible');

		console.log('API', error);
        throw Error(error);
	}
);

export default API;
