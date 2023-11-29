import Brand from '@/components/Brand'
import { Typography } from '@mui/material'
import React from 'react'
import { Button, Form, Panel, Stack } from 'rsuite'
import { url } from '../../../url'
import axios from 'axios'
import { notification } from 'antd'


type Props = {}
type NotificationType = 'success' | 'error'


const ChangePassword = (props: Props) => {
    const [visible, setVisible] = React.useState(false);

    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassWord] = React.useState('')
    const [comparePassword, setComparePassword] = React.useState('')
    const [formError, setFormError] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [api, contextHolder] = notification.useNotification()


    const openNotificationWithIcon = (type: NotificationType, error?: string) => {
        console.log(error);

        api[type]({
            message: 'Đổi mật khẩu',
            description: type === 'success' ? 'Đổi mật khẩu thành công ' : error
        })
    }
    React.useEffect(() => {
        if (currentPassword.length && newPassword.length && comparePassword.length) {
            setFormError('')
        }
    }, [newPassword, comparePassword, currentPassword])

    const handleSubmitForm = async () => {
        const bearerToken = localStorage.getItem('sessionId')
        setIsLoading(true)
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${bearerToken}`
        }
        const values = {
            password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: comparePassword,
        }
        axios({
            method: "put",
            url: `${url}/auth/password`,
            data: JSON.stringify(values),
            headers: headers
        }).then((res) => {
            if (res.status === 200) {
                setCurrentPassword('')
                setNewPassWord('')
                setComparePassword('')
                openNotificationWithIcon("success")
            }
            setIsLoading(false)
        }).catch((error) => {
            console.log(error);
            setFormError(error.response.data.message)
            openNotificationWithIcon("error", error.response.data.message)
        })
    }
    return (
        <>
            {contextHolder}

            <Stack
                justifyContent="center"
                alignItems="center"
                direction="column"
                style={{
                    height: '100vh'
                }
                }
            >
                <Brand style={{ marginBottom: 10 }} />
                <Panel
                    header={<h3>Đổi mật khẩu</h3>}
                    bordered
                    style={{ background: '#fff', width: 400 }}
                >


                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel>Mật khẩu hiện tại</Form.ControlLabel>
                            <Form.Control required value={currentPassword} type='password' onChange={(value: string) => { setCurrentPassword(value) }} name="currentPassword" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Mật khẩu mới</Form.ControlLabel>
                            <Form.Control type='password' required value={newPassword} onChange={(value: string) => { setNewPassWord(value) }} name="newPassword" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Xác nhận mật khẩu mới</Form.ControlLabel>
                            <Form.Control required type='password' value={comparePassword} onChange={(value: string) => { setComparePassword(value) }} name="comparePassword" />
                        </Form.Group>

                        {
                            formError && (
                                <Typography mb="1rem" color="red">
                                    {formError}
                                </Typography>
                            )
                        }

                        <Form.Group>
                            <Stack spacing={6}>
                                <Button onClick={() => {
                                    if (currentPassword.length && newPassword.length && comparePassword) {
                                        if (newPassword === comparePassword) {
                                            handleSubmitForm()
                                        }
                                        else {
                                            setFormError('Mật khẩu mới và mật khẩu xác thực không giống nhau')
                                        }
                                    }
                                    else {
                                        setFormError('Vui lòng điền đầy đủ thông tin')
                                    }
                                }} appearance="primary">Submit</Button>
                            </Stack>
                        </Form.Group>
                    </Form>
                </Panel>
            </Stack >
        </>

    )
}

export default ChangePassword