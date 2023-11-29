import React, { useEffect } from 'react';

import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider, InputNumber } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Link } from 'react-router-dom';
import Brand from '@/components/Brand';
import axios from 'axios';
import { url } from '../../../url'
import { notification } from 'antd'
import { Typography } from '@mui/material';
import { log } from 'console';

type NotificationType = 'success' | 'duplicatedEmail' | 'duplicatedUsername' | 'invalidHubId' | 'error'

const PartnerAccount = () => {
    const [visible, setVisible] = React.useState(false);
    const [email, setEmail] = React.useState<string>('')
    const [username, setUsername] = React.useState<string>('')
    const [hubId, setHubId] = React.useState<number>(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [formError, setFormError] = React.useState<any>('');

    const [api, contextHolder] = notification.useNotification()



    const openNotificationWithIcon = (type: NotificationType, error?: string, data?: any) => {
        console.log(data);

        api[type]({
            message: 'Tạo tài khoản cho nhân viên',
            description: type === 'success' ? `Tạo tài khoản thành công. \n Mật khẩu tự khởi tạo: ${data.data.staff.generated_password} ` : error
        })
    }

    useEffect(() => {
        if (email.length && username.length && hubId) {
            setFormError('')
        }
        else {
        }
    }, [email, username, hubId])


    const handleChangeUsername = (e: string) => {
        setUsername(e);
        console.log(e);

    }
    const handleChangeEmail = (e: string) => {
        setEmail(e)
    }
    const handleChangeHubId = (e: number | any) => {
        setHubId(e)
    }

    const handleSubmitForm = async () => {
        const bearerToken = localStorage.getItem('sessionId')


        setIsLoading(true)
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${bearerToken}`
        }
        const values = {
            email: email,
            username: username,
            hub_id: hubId
        }
        console.log(JSON.stringify(values));
        try {
            axios({
                method: 'post',
                url: `${url}/account/staff`,
                data: JSON.stringify(values),
                headers: headers
            })
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res.data);
                        setUsername('')
                        setEmail('')
                        setHubId(0)
                        openNotificationWithIcon('success', '', res.data)
                    }
                    setIsLoading(false)
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        setFormError(error.response.data.message);
                        openNotificationWithIcon('error', error.response.data.message)

                    } else if (error.request) {
                        console.log("No response received");
                        setFormError(500); // Default to a generic error status
                        openNotificationWithIcon('error')

                    } else {
                        console.log("Error setting up the request", error.message);
                        setFormError(500); // Default to a generic error status
                        openNotificationWithIcon('error')

                    }

                })
        } catch (error) {
            console.log(error);

        }

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
                }}
            >
                <Brand style={{ marginBottom: 10 }} />
                <Panel
                    header={<h3>Tạo tài khoản nhân viên</h3>}
                    bordered
                    style={{ background: '#fff', width: 400 }}
                >


                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control required value={email} onChange={handleChangeEmail} name="email" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Tài khoản</Form.ControlLabel>
                            <Form.Control required value={username} onChange={handleChangeUsername} name="username" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Hub Id</Form.ControlLabel>
                            <InputNumber min={1} required value={hubId !== 0 ? hubId : ''} onChange={handleChangeHubId} name="hubId" />
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
                                    if (email.length && username.length && hubId) {

                                        handleSubmitForm()
                                    }
                                    else {
                                        setFormError('Vui lòng điền đầy đủ thông tin')
                                    }
                                }} appearance="primary">Submit</Button>
                            </Stack>
                        </Form.Group>
                    </Form>
                </Panel>
            </Stack>

        </>
    );
};

export default PartnerAccount;
