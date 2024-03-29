import LocalStorage from "../../App/state/LocalStorage";
import axios from "axios";
import { LoggedAPI_T } from "../Types/types"; 

export const instanse = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000/',
    headers: {
        'Content-Type': 'application/json'
    }
})
// Interceptor, устанавливающий в headers каждого запроса AccessToken
instanse.interceptors.request.use((config: any) => {
    config.headers.Authorization = `Bearer ${LocalStorage.AccessToken}`
    return config
})

// Interceptor, отлавливающий ошибку, которую вызывает отсутствие AccessToken-а, и посылающий запрос на получение новой пары токенов
instanse.interceptors.response.use((config: any) => {
    return config;
}, async (error) => {
    const OriginalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        OriginalRequest._isRetry = true
        try {
            let response = await instanse.get('/auth/refresh')
            LocalStorage.setToken(response.data.AccessToken)
            return instanse.request(OriginalRequest)
        } catch (e) {
            console.log(e)
        }
    }
    throw error;
})

export const LoggedAPI: LoggedAPI_T  = async () => {
    let response = await instanse.get('/auth')
    let result = {
            status: response.status,
            data: response.data
    }
    return result
}