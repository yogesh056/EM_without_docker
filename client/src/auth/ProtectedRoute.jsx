import API from "../middleware/api"
const Auth = {
	isAuthenticated:false,
	authenticate() {
	this.isAuthenticated = true;
	},
	signout() {
	this.isAuthenticated = false;
	},
	getAuth() {
	return this.isAuthenticated;
	},
	async getUserDetails()
	{	
		const isLogged=localStorage.getItem('user_id')
		let response= await API.post('/users/user',{user_id:isLogged}).then(
			res=>{
				console.log("123",res)
				return res.data.response
			}
		)
         return Promise.resolve(response)
	}
}
	export default Auth;