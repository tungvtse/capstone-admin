import React, { useEffect, useState } from 'react';
import {
    Input,
    InputGroup,
    Table,
    Button,
    DOMHelper,
    Progress,
    Checkbox,
    Stack,
    SelectPicker, Modal,
    Placeholder,
    Whisper,
    IconButton,
    Popover,
    Dropdown
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import DrawerView from './DrawerView';
import { NameCell, ImageCell, CheckCell, ActionCell, StatusCell } from '../Cells';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { url } from '../../../url'
import { useDispatch } from 'react-redux';
import { setOrderCount } from '@/store/counteSlice';
import { Tag } from "antd"


const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

type Props = {
    type: string
}


type Order = {
    id: number;
    code: string;
    sender_name: string;
    sender_phone: string;
    sender_email: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_email: string;
    partner_name: string;
    note: string;
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


const DataTable = (props: Props) => {
    const { type } = props
    const [showDrawer, setShowDrawer] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Order>()
    const [idOpen, setIdOpen] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [dataArray, setDataArray] = useState([]);
    const [dataRender, setDataRender] = useState<any[]>([]);
    const [selectedCode, setSelectedCode] = useState<string>('');

    const dispatch = useDispatch()


    const whisperRef = React.useRef(null); // Create a ref


    const handleOpen = (id) => {
        setIdOpen(id)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }


    let checked = false;
    let indeterminate = false;

    if (checkedKeys.length === dataRender.length) {
        checked = true;
    } else if (checkedKeys.length === 0) {
        checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < dataRender.length) {
        indeterminate = true;
    }

    const getStatus = (i: number) => {
        switch (i) {
            case 0: {
                return "Đã tạo đơn"
            }
            case 1: {
                return "Đẫ xác nhận"
            }
            case 2: {
                return "Đã chấp nhận"
            }
            case 3: {
                return "Đang giao"
            }
            case 4: {
                return "Đã giao"
            }
            case 5: {
                return "Hoàn thành"
            }
            case 6: {
                return "Đã hủy"
            }
        }
    }

    const filteredData = () => {
        const filtered = dataRender.filter((item) => item.code.includes(searchKeyword));

        if (sortColumn && sortType) {
            return filtered.sort((a, b) => {
                let x: any = a[sortColumn];
                let y: any = b[sortColumn];

                if (typeof x === 'string') {
                    x = x.charCodeAt(0);
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt(0);
                }

                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }
        return filtered;
    };
    console.log(localStorage.getItem('sessionId'));

    React.useEffect(() => {

        const newData = dataArray.map((item: any, i) => {
            return {
                id: item.id,
                partner_name: item.attributes.partner_name,
                code: item.attributes.code,
                sender_name: item.attributes.sender_name,
                sender_phone: item.attributes.sender_phone,
                receiver_name: item.attributes.receiver_name,
                receiver_phone: item.attributes.receiver_phone,
                is_paid: item.attributes.is_paid,
                parameter: {
                    weight: item.attributes.weight,
                    height: item.attributes.height,
                    length: item.attributes.length,
                    width: item.attributes.width
                },
                package_type: item.attributes.package_types,
                package_value: item.attributes.package_value,
                note: item.attributes.note,
                current_status: item.attributes.current_status
            }
        })
        setDataRender(newData)
    }, [dataArray])

    useEffect(() => {
        console.log(dataRender);

    }, [dataRender])

    const convertLength = (value: number) => {
        if (value < 1000) {
            return value + "mm"
        }
        else return (value / 1000).toFixed(2) + "m"
    }
    const convertWeight = (value: number) => {
        if (value < 1000) {
            return value + "g"
        }
        else {
            return Math.round(value / 1000) + "kg"
        }
    }


    const handleSortColumn = (sortColumn, sortType) => {
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    const handleRowClick = (rowData) => {
        console.log(rowData);

        setSelectedData(rowData)
        setOpen(true)
    }
    const bearerToken = localStorage.getItem('sessionId')

    const getOrderList = async () => {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${bearerToken}`

        }
        setIsLoading(true)
        if (type === 'delivering') {
            try {
                axios({
                    method: 'get',
                    url: `${url}/orders/delivering`,
                    headers: headers
                }).then((res) => {
                    setDataArray(res.data.data)
                    setIsLoading(false)
                    dispatch(setOrderCount({
                        orderCount: res.data.data.length
                    }))
                    localStorage.setItem('orderCount', res.data.data.length)
                }).catch((error) => {
                    console.log(error);
                    setIsLoading(false)
                })
            } catch (error) {
                console.log(error);
                setIsLoading(false)

            }
        }
        else if (type === 'delivered') {

            try {
                axios({
                    method: 'get',
                    url: `${url}/orders/delivered`,
                    headers: headers
                }).then((res) => {
                    setDataArray(res.data.data)
                    setIsLoading(false)
                    dispatch(setOrderCount({
                        orderCount: res.data.data.length
                    }))
                    localStorage.setItem('orderCount', res.data.data.length)

                }).catch((error) => {
                    console.log(error);
                    setIsLoading(false)

                })
            } catch (error) {
                console.log(error);
                setIsLoading(false)

            }
        }
    }

    React.useEffect(() => {
        getOrderList()
        setIsLoading(true)

    }, [type])

    const handleSelect = (eventKey) => {
        console.log(eventKey);
        whisperRef.current?.close();



        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${bearerToken}`

        }

        try {
            axios({
                method: "put",
                url: `${url}/orders/${selectedCode}/status/${eventKey}`,
                headers: headers
            })
                .then((res) => {
                    console.log(res);
                    getOrderList()
                }).catch((error) => {
                    console.log(error);

                })
        } catch (error) {
            console.log(error);

        }
    }



    return (
        <>
            <Stack className="table-toolbar" justifyContent="space-between">


                <Stack spacing={6}>

                    <InputGroup inside>
                        <Input placeholder="Tìm kiếm theo mã code" value={searchKeyword} onChange={setSearchKeyword} />
                        <InputGroup.Addon>
                            <SearchIcon />
                        </InputGroup.Addon>
                    </InputGroup>
                </Stack>
            </Stack>

            <Table
                height={Math.max(getHeight(window) - 100, 400)}
                data={filteredData()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                loading={isLoading}
            >

                <Column width={150} align="center" fixed>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Id</HeaderCell>
                    <Cell dataKey="id" />

                </Column>


                <Column width={120} sortable>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Mã đơn hàng</HeaderCell>
                    <Cell style={{
                        alignItems: 'center',
                        paddingTop: ''
                    }} >
                        {rowData => {

                            return (<Typography onClick={() => { handleRowClick(rowData) }} fontSize={'14px'} width="80%" color="#3498ff" >
                                {rowData.code}
                            </Typography>)
                        }}
                    </Cell>
                </Column>
                <Column width={150} sortable>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Người gửi</HeaderCell>
                    <Cell style={{
                        alignItems: 'center',
                        paddingTop: ''
                    }} >
                        {rowData => {

                            return (<Typography onClick={() => { handleRowClick(rowData) }} fontSize={'14px'} width="80%" color="#575757" >
                                {rowData.sender_name}
                            </Typography>)
                        }}
                    </Cell>
                </Column>

                <Column width={150}>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Người nhận</HeaderCell>
                    <Cell style={{
                        alignItems: 'center',
                        paddingTop: ''
                    }} >
                        {rowData => {

                            return (<Typography onClick={() => { handleRowClick(rowData) }} fontSize={'14px'} width="80%" color="#575757" >
                                {rowData.receiver_name}
                            </Typography>)
                        }}
                    </Cell>
                </Column>


                <Column width={150}>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Trạng thái thanh toán</HeaderCell>
                    <Cell style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '8px'
                    }} >
                        {rowData => {

                            return (
                                <Tag color={rowData.is_paid === true ? "success" : "error"} > {rowData.is_paid === true ? "Đã thanh toán" : "Chưa thanh toán"}</Tag>

                            )
                        }}
                    </Cell>
                </Column>
                <Column width={150}>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Trạng thái đơn hàng</HeaderCell>
                    <Cell style={{
                        alignItems: 'center',
                    }} >
                        {rowData => {

                            return (<Typography onClick={() => { handleRowClick(rowData) }} fontSize={'14px'} width="80%" color="#575757" >
                                {rowData.current_status === 3 ? "Đang trên đường đến trạm tiếp theoo" : "Đang ở trạm"}
                            </Typography>)
                        }}
                    </Cell>
                </Column>
                <Column width={120}>
                    <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>
                        Cập  nhật đơn hàng
                    </HeaderCell>
                    <Cell>
                        {rowData => {
                            return (<Whisper style={{ paddingBottom: "1rem" }} ref={whisperRef} placement="autoVerticalEnd" onClick={() => {
                                setSelectedCode(rowData.code)
                            }} trigger="click" speaker={(
                                <Popover visible={false} full>
                                    <Dropdown.Menu onSelect={handleSelect} >
                                        <Dropdown.Item eventKey={rowData.current_status === 3 ? 'delivered' : (rowData.current_status === 4 ? 'delivering' : '')}>
                                            {rowData.current_status === 3 ? "Đã giao đến trạm " : " Giao đến trạm tiếp theo"}
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Popover>
                            )}>
                                <IconButton style={{
                                    padding: "0px 10px 5px"
                                }} appearance="subtle" icon={<MoreIcon />} />
                            </Whisper>)
                        }}

                    </Cell>
                </Column>
            </Table>
            <Modal size={'sm'} open={open} onClose={handleClose} >
                <Modal.Header>
                    <Modal.Title>Mã đơn: {selectedData && selectedData.code}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        selectedData && (
                            <>
                                <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} gap="0.5rem">
                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'}>
                                        <Typography fontWeight={'bold'}>
                                            Người gửi:
                                        </Typography>
                                        <Typography justifyContent={'flex-end'}>
                                            {selectedData.sender_name}
                                        </Typography>
                                    </Box>

                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'}>
                                        <Typography justifyContent={'flex-start'} fontWeight={'bold'}>
                                            Số điện thoại người gửi:
                                        </Typography>
                                        <Typography>
                                            {selectedData.sender_phone}
                                        </Typography>
                                    </Box>

                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'}>
                                        <Typography fontWeight={'bold'}>
                                            Người nhận:
                                        </Typography>
                                        <Typography>
                                            {selectedData.receiver_name}
                                        </Typography>
                                    </Box>
                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'}>
                                        <Typography fontWeight={'bold'}>
                                            Số điện thoại người nhận:
                                        </Typography>
                                        <Typography>
                                            {selectedData.receiver_phone}
                                        </Typography>
                                    </Box>


                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'}>
                                        <Typography fontWeight={'bold'}>
                                            Nhà xe thực hiện gửi hàng
                                        </Typography>
                                        <Typography>
                                            {selectedData.partner_name}
                                        </Typography>
                                    </Box>
                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'} flexWrap={'wrap'}>
                                        <Typography fontWeight={'bold'}>
                                            Thông số kiện hàng:
                                        </Typography>
                                        <Box display={'flex'} gap="0.25rem" bgcolor={'#71B8E7'} borderRadius="10px" p="0.25rem" >
                                            <Typography fontWeight={'bold'}>
                                                Chiều dài
                                            </Typography>
                                            <Typography fontWeight={''}>
                                                {convertLength(selectedData.parameter.length)}
                                            </Typography>
                                        </Box>
                                        <Box display={'flex'} gap="0.25rem" bgcolor={'#71B8E7'} borderRadius="10px" p="0.25rem" >
                                            <Typography fontWeight={'bold'}>
                                                Chiều rộng                                            </Typography>
                                            <Typography fontWeight={''}>
                                                {convertLength(selectedData.parameter.width)}
                                            </Typography>
                                        </Box>
                                        <Box display={'flex'} gap="0.25rem" bgcolor={'#71B8E7'} borderRadius="10px" p="0.25rem" >
                                            <Typography fontWeight={'bold'}>
                                                Chiều cao
                                            </Typography>
                                            <Typography fontWeight={''}>
                                                {convertLength(selectedData.parameter.height)}
                                            </Typography>
                                        </Box>
                                        <Box display={'flex'} gap="0.25rem" bgcolor={'#71B8E7'} borderRadius="10px" p="0.25rem" >
                                            <Typography fontWeight={'bold'}>
                                                Cân nặng
                                            </Typography>
                                            <Typography fontWeight={''}>
                                                {convertWeight(selectedData.parameter.weight)}
                                            </Typography>
                                        </Box>

                                    </Box>
                                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="0.5rem" width={'100%'} flexWrap={'wrap'}>
                                        <Typography fontWeight={'bold'}>
                                            Ghi chú:
                                        </Typography>
                                        <Typography>
                                            {selectedData.note}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} appearance="primary">
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <DrawerView open={showDrawer} onClose={() => setShowDrawer(false)} />
        </>
    );
};

export default DataTable;
