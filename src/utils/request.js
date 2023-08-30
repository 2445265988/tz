import axios from 'axios'

const service = axios.create({
    baseURL: 'http://localhost:9091',
    // withCredentials: true, // send cookies when cross-domain requests
    // timeout: 100000, // request timeout
})

// 定义请求拦截器
service.interceptors.request.use(
    // 请求对象(里面包含请求头、url等)
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 定义响应拦截器
service.interceptors.response.use(
    response => {
        // 取响应的data部分
        const res = response.data
        // 正确响应code为2000
        return res

    },
    error => {
        return Promise.reject(error)
    }
)
export default service