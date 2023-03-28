import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { AuthAPI } from "../../Side/API/Api"
import LocalStorage from "../../Side/Mobx/LocalStorage"
import styles from './AuthPage.module.css'
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import ReCAPTCHA from "react-google-recaptcha"
import { sitekey } from './../../../../env'
import { message } from 'antd';
import { LoginErrorHandler } from "../ErrorHandlers/AuthErrorHandlers"
import { ModalWindow } from "../Modal/Modal"
import { LoggedController } from "../Controllers/AuthControllers"

const AuthPage = (props: {setError: (value: string) => void}) => {
    // Проверка авторизации
    useEffect(() => {
        LoggedController(props.setError)
    }, [])
    // Форма логина
    const LoginFormAnt = () => {
        const navigate = useNavigate()
        // Значение капчи
        let [captchaToken, setCaptchaToken] = useState('')
        let [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false)
        // Загрузка кнопки "войти" после отправки формы
        let [loading, setLoading] = useState(false)
        // Callback, который вызывается на отправку формы
        const onFinish = async (values: any) => {
            setLoading(true)
            try {
                let res = await AuthAPI.Login(values.login, values.password, values.remember, captchaToken)
                if (res.status === 200) {
                    LocalStorage.setUserData(res.data.name, res.data.lastName, res.data.email, res.data.imgSRC)
                    LocalStorage.setToken(res.data.AccessToken)
                    LocalStorage.setIsAuthorized(true)
                    if(!res.data.isActivated) {
                        LocalStorage.setNotedAboutActivated(false)
                        LocalStorage.setIsActivated(res.data.isActivated)
                    }
                }
            } catch (e: any) {
                console.log(e)
                props.setError(e.response.data.message)
            } finally {
                setLoading(false)
            }
        };
        // Callback, который вызывает выполнение капчи
        const onChange = (value: string) => {
            setIsCaptchaSuccess(true)
            setCaptchaToken(value)
        }
        return <div style={{ background: 'white', padding: '30px 50px 0 50px', borderRadius: '20px' }}>
            <Form
                name="normal_login"
                className={styles.loginForm}
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                {/* Логин */}
                <Form.Item
                    name="login"
                    rules={[{ required: true, message: 'Пожалуйста, введите Ваш логин!' }]}
                >
                    <Input prefix={<UserOutlined className={styles.siteFormItemIcon} />} placeholder="Логин" />
                </Form.Item>

                {/* Пароль */}
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите Ваш пароль!' }]}
                >
                    <Input
                        prefix={<LockOutlined className={styles.siteFormItemIcon} />}
                        type="password"
                        placeholder="Пароль"
                    />
                </Form.Item>

                {/* Запомнить меня */}
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Запомнить меня</Checkbox>
                    </Form.Item>

                    <a className={styles.loginFormForgot} onClick={() => {navigate('/forgotmypassword')}}>
                        Забыли пароль?
                    </a>
                </Form.Item>

                {/* Капча */}
                <ReCAPTCHA
                    sitekey={sitekey}
                    onChange={(value: any) => { onChange(value) }}
                />

                {/* Кнопка "войти" */}
                <Form.Item>
                    <Button disabled={!isCaptchaSuccessful} type="primary" htmlType="submit" loading={loading} className={styles.loginFormButton}>
                        Войти
                    </Button>
                    Или <a onClick={() => { navigate('/register') }}>создать аккаунт</a>
                </Form.Item>
            </Form>
        </div>
    }
    return <div className={styles.auth_page}>
        <LoginFormAnt />
    </div>
}

export default AuthPage