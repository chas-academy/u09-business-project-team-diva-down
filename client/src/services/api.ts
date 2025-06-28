import axios from 'axios';

const API = axios.create({
    baseURL: 'https://u09-business-project-team-diva-down.onrender.com/',
    withCredentials: true
});

export default API