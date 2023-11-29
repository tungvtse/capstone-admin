import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import DataTable from './DataTable';
import { Box, Divider } from '@mui/material';
import Typography from 'antd/es/typography/Typography';

const typeOrders = [
    {
        value: 'delivering',
        label: 'Đơn hàng đang được giao',
    },
    {
        value: 'delivered',
        label: 'Đơn hàng đã được giao'
    }
]

const OrderTable = () => {
    const [orderSelect, setOrderSelect] = React.useState('delivering')
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Danh sách đơn hàng yêu cầu</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Bảng</Breadcrumb.Item>
                        <Breadcrumb.Item active>Danh sách đơn hàng yêu cầu</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <Box display={'flex'} gap="2rem" justifyContent={'flex-start'} alignItems={'center'}>
                {typeOrders.map((item) => {
                    return (
                        <Box key={item.value} onClick={() => { setOrderSelect(item.value) }} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                            <Typography color={orderSelect === item.value ? "black" : "#767676"}>
                                {item.label}
                            </Typography>
                            <Divider sx={{
                                backgroundColor: orderSelect === item.value ? '#3EBDE0' : 'rgb(238, 238, 238)',
                                height: orderSelect === item.value ? '2px' : '0px',
                                width: '200px',
                                opacity: orderSelect === item.value ? 1 : 0
                            }} />
                        </Box>
                    )
                })}


            </Box>
            <DataTable type={orderSelect} />
        </Panel>
    );
};

export default OrderTable;
