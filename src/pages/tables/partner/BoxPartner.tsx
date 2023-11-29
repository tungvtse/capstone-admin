import { Box, Typography } from '@mui/material';
import React from 'react'

type Props = {
    create_at: string;
    id: string;
    name: string;
    phone: string
}

const BoxPartner = (props: Props) => {
    const { create_at, id, name, phone } = props
    return (
        <>
            <Box display={'flex'} gap="1%" justifyContent={'center'} alignItems={'center'} p="1rem" borderRadius={'10px'} boxShadow={'2'}>
                <Box flexBasis={'30%'}>
                    <img src="https://phongma.vn/wp-content/uploads/2018/04/van-tai-nguyen-khang-4-e1514207958138.jpg" style={{
                        width: '100px', borderRadius: "50%", height: '100px'
                    }} />
                </Box>
                <Box flexDirection={'column'} display={'flex'} flexBasis={'69%'}>
                    <Box>
                        <Typography fontWeight={"bold"} fontSize={"16px"} color="#373d58">Tên đối tác: {name}</Typography>
                    </Box>
                    <Box>
                        <Typography fontWeight={"600"} fontSize={"14px"} color="#373d58">
                            Số điện thoại: {phone}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography fontWeight={"600"} fontSize={"14px"} color="#373d58">
                            Ngày tham gia: {create_at.split('T')[0]}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default BoxPartner