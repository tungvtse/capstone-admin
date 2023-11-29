import React, { useState } from 'react'
import * as yup from 'yup'
import banner from '../../images/bg-login.jpg'
import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography, useMediaQuery } from '@mui/material';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { url } from '../../url'
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';
import { useDispatch } from 'react-redux';
import { setRole } from '@/store/roleSlice';


type Props = {}

const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
    device_name: yup.string().required("require")
});

const initialValuesLogin = {
    username: "",
    password: "",
    device_name: "web"
};



const LoginPage = (props: Props) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loginError, setLoginError] = useState<number>();
    const [isLoading, setIsLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const login = async (values: any, formSubmitProps: any) => {
        setIsLoading(true)
        console.log(JSON.stringify(values));
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        axios({
            method: 'post',
            url: `${url}/login/token`,
            data: JSON.stringify(values),
            headers: headers
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data.data);
                    localStorage.setItem('sessionId', res.data.data.access_token)
                    localStorage.setItem('username', res.data.data.staff.username)
                    setIsLoggedIn(true)
                    const headers = {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${res.data.data.access_token}`
                    }
                    try {
                        axios({
                            method: 'get',
                            headers: headers,
                            url: `${url}/profile/me`
                        }).then((res) => {
                            console.log(res.data.data.type);
                            localStorage.setItem('role', res.data.data.type)
                            dispatch(setRole({
                                role: res.data.data.type
                            }))

                        }).catch((error) => {
                            console.log(error);

                        })
                    } catch (error) {
                        console.log(error);

                    }
                    navigate("/")
                }
                setIsLoading(false)


            }).catch((error) => {
                console.log(error.response.status);

                setLoginError(error.response.status)



            })
        formSubmitProps.resetForm()
    }

    const handleFormSubmit = async (values: any, onSubmitProps: any) => {
        login(values, onSubmitProps)
    }

    return (
        <>

            <Box height="100vh" display="flex">
                <Box flexBasis={isNonMobile ? "55%" : "0%"} position="relative">
                    <img
                        src={banner}
                        alt="banner"
                        style={{
                            height: "100%",
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        className="w-full rounded-10"
                    />

                    <Box zIndex="10" position="absolute" top="50%" left="50%" sx={{
                        transform: 'translate(-50%, -49%)'
                    }}>
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    />
                </Box>
                <Box flexBasis={isNonMobile ? "45%" : "100%"} p="2rem" justifyContent="center" alignItems="center" display="flex" flexDirection="column">
                    <Box >
                        <Link to="/">

                        </Link>
                    </Box>
                    <Box display="flex">
                        <Typography color="#515151" fontSize="3rem" fontWeight="bold">
                            ChanhXe
                        </Typography>
                        <Typography color="#3EBDE0" fontSize="3rem" fontWeight="bold">
                            Admin
                        </Typography>
                    </Box>

                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValuesLogin}
                        validationSchema={loginSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            resetForm,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box>
                                    <TextField

                                        margin="normal"
                                        required
                                        fullWidth
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.username}
                                        id="username"
                                        label="Tên người dùng"
                                        error={Boolean(touched.username) && Boolean(errors.username)}
                                        helperText={touched.username && errors.username}
                                        name="username"
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        fullWidth
                                        name="password"
                                        label="Mật khẩu"
                                        type="password"
                                        id="password"
                                        error={Boolean(touched.password) && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                    />

                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Ghi nhớ đăng nhập cho lần tới"
                                    />
                                    {(loginError && isEqual(loginError, 422)) && (
                                        <Typography color="red">
                                            Tài khoản hoặc mật khẩu không đúng, vui lòng đăng nhập lại!
                                        </Typography>
                                    )}
                                    <Button
                                        type='submit'
                                        fullWidth
                                        sx={{ mt: 2, mb: 2, color: 'white', bgcolor: "#3EBDE0", fontWeight: "bold" }}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Divider sx={{
                                        borderWidth: 1.5,
                                        borderColor: "#A1A1A1"
                                    }} />
                                    <Button
                                        href='/sign-up'
                                        fullWidth
                                        sx={{ mt: 2, mb: 2, color: '#3EBDE0', bgcolor: "white", fontWeight: "bold", border: "1px solid #3EBDE0" }}
                                    >
                                        Đăng ký
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box >
        </>
    )
}

export default LoginPage