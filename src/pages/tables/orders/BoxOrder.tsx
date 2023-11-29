import { Box } from '@mui/material'
import React from 'react'

type Props = {
    id: number;
    code: string;
    sender_name: string;
    sender_phone: string;
    sender_email: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_email: string;
    price: number;
    deli_price: number;
    payment_method: string;
    parameter: {
        weight: number;
        height: number;
        length: number;
        width: number
    },
    package_type: string;
    collect_on_deli: Boolean
}

const BoxOrder = (item: Props) => {
    return (
        <Box>

        </Box>
    )
}

export default BoxOrder