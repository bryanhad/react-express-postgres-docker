import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' },
})

export default api
