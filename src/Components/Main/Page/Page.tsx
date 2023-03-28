import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { AuthAPI } from "../../Side/API/Api"
import AuthPage from "../Auth/AuthPage"
import Body from "../Body/Body"
import LoadingScreen from "../LoadingScreen/LoadingScreen"
import LocalStorage from "../../Side/Mobx/LocalStorage"
import Register from "../Register/Register"
import { message } from "antd"
import ForgotMyPassword from "../ForgotMyPassword/ForgotMyPassword"

const Page = observer(() => {
    const [messageApi, contextHolder] = message.useMessage();
    const setError = (value: string) => {
        messageApi.open({
            type: 'error',
            content: value,
        });
    }
    const setSuccess = (value: string) => {
        messageApi.open({
            type: 'success',
            content: value,
        });
    }
    // Редирект в зависимости от того, авторизован пользователь или нет
    let navigate = useNavigate()
    useEffect(() => {
        if (LocalStorage.IsAuthorized === false) {
            navigate('/login')
        } else {
            navigate('/')
        }
    }, [LocalStorage.IsAuthorized])
    return <div>
        {contextHolder}
        <Routes>
            <Route path="/login" element={<AuthPage setError={setError}/>} />
            <Route path="/" element={<Body setError={setError}/>} />
            <Route path="/register" element={<Register setError={setError}/>} />
            <Route path="/forgotmypassword" element={<ForgotMyPassword setError={setError} setSuccess={setSuccess}/> } />
        </Routes>
    </div>
    
})

const PageAPIContainer = () => {
    let [loading, setLoading] = useState(true)
    useEffect(() => {
        let a = async () => {
            try {
                let response = await AuthAPI.Logged()
                if (response.status === 200) {
                    LocalStorage.setUserData(response.data.name, response.data.lastName, response.data.email)
                    LocalStorage.setToken(response.data.AccessToken)
                    LocalStorage.setIsAuthorized(true)
                }
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        a()
    }, [])
    if (loading) {
        return <LoadingScreen />
    } else {
        return <Page />
    }
}

export default PageAPIContainer