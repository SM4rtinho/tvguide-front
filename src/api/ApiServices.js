import axios from 'axios';

export const api = {
    newUser: (data) => {
        const token = localStorage.getItem('token');
        return axios.post("http://localhost:8081/user", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    getMe: () => {
        const token = (localStorage.getItem('token'));
        return axios.get("http://localhost:8081/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        },
    login:(data)=>{
        return axios.post("http://localhost:8081/auth/authenticate",data)
    },
    register:(data)=>{
        return axios.post("http://localhost:8081/auth/register",data)
    }
}