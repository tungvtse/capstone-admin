import React, { useEffect } from 'react';

import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Link } from 'react-router-dom';
import Brand from '@/components/Brand';
import axios from 'axios';
import { url } from '../../../url'
import { notification } from 'antd'
import { Typography } from '@mui/material';

type NotificationType = 'success' | 'error'

const PartnerAccount = () => {
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [formError, setFormError] = React.useState<any>();

  const [api, contextHolder] = notification.useNotification()



  const openNotificationWithIcon = (type: NotificationType, error?: any, data?: any) => {

    api[type]({
      message: 'Tạo tài khoản cho partner',
      description: type === `success` ? `Tạo tài khoản thành công. Mật khẩu tự khởi tạo:  ${data.data.partner.generated_password}` : "Tài khoản đã được tạo từ trước"
    })
  }

  useEffect(() => {
    if (name.length && username.length) {
      setFormError('')
    }
    else {
    }
  }, [name, username])


  const handleChangeUsername = (e: string) => {
    setUsername(e);
    console.log(e);

  }
  const handleChangeName = (e: string) => {
    setName(e)
  }

  const handleSubmitForm = async () => {
    const bearerToken = localStorage.getItem('sessionId')
    console.log(bearerToken);

    setIsLoading(true)
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${bearerToken}`
    }
    const values = {
      name: name,
      username: username
    }
    axios({
      method: 'post',
      url: `${url}/account/partner`,
      data: JSON.stringify(values),
      headers: headers
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setUsername('')
          setName('')
          openNotificationWithIcon('success', '', res.data)
        }
        setIsLoading(false)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          setFormError(error.response.data.message);
        } else if (error.request) {
          console.log("No response received");
          setFormError(500); // Default to a generic error status
        } else {
          console.log("Error setting up the request", error.message);
          setFormError(500); // Default to a generic error status
        }
        openNotificationWithIcon('error', error)

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
        }}
      >
        <Brand style={{ marginBottom: 10 }} />
        <Panel
          header={<h3>Tạo tài khoản partner</h3>}
          bordered
          style={{ background: '#fff', width: 400 }}
        >


          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control required value={username} onChange={handleChangeUsername} name="username" />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Name</Form.ControlLabel>
              <Form.Control type='name' required value={name} onChange={handleChangeName} name="name" />
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
                  if (name.length && username.length) {
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
