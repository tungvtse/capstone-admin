import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {

    DrawerProps,
    Button,
    Form,
    Stack,
    InputNumber,
    InputGroup,
    Slider,
    Rate,
    Table,
    Modal,
} from 'rsuite';
import { CiCirclePlus } from "react-icons/ci";
import { Drawer, DatePicker, Tag } from 'antd';
import { url } from '../../../url'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { increaseCount } from '@/store/counteSlice';


const { Column, HeaderCell, Cell } = Table;

type Items = {
    from_kilometer: string,
    to_kilometer: string,
    price_per_kilometer: string,
    min_amount: string,
    max_amount: string
}

type Price = {
    apply_from: string,
    apply_to: string,
    name: string,
    priority: number,
    note: string,
    items: Items[]
}

const InputItems = ({ onInputChange }) => {
    const [items, setItems] = React.useState<Items>({
        from_kilometer: '',
        to_kilometer: '',
        price_per_kilometer: '',
        min_amount: '',
        max_amount: ''
    })
    const [error, setError] = React.useState<string>('')
    const [kilometerBefore, setKilometerBefore] = React.useState<string>('')
    const [count, setCount] = React.useState(0)

    const handleInputSubmit = () => {
        onInputChange(items);
        setKilometerBefore(items.to_kilometer)
        setCount(count + 1)
        setItems({
            from_kilometer: '',
            to_kilometer: '',
            price_per_kilometer: '',
            min_amount: '',
            max_amount: ''
        })
    }

    React.useEffect(() => {

        if (count > 0 && parseInt(items.from_kilometer) !== parseInt(kilometerBefore)) {
            setError("Quãng đường tối thiểu phải bằng với quãng đường tối đa trước đó")
        }
        else {
            if (parseInt(items.from_kilometer) > parseInt(items.to_kilometer)) {
                setError('Quãng đường tối thiểu không thể lớn hơn quãng đường tối ta')
            }
            else {
                setError('')
            }
        }

    }, [items.from_kilometer, items.to_kilometer, kilometerBefore, count])

    React.useEffect(() => {
        if (parseInt(items.min_amount) > parseInt(items.max_amount)) {
            setError('Giá tối thiểu không thể lớn hơn giá tối đa')
        }
        else {
            setError('')
        }
    }, [items.min_amount, items.max_amount])

    React.useEffect(() => {
        if (items.from_kilometer.length > 0 && items.to_kilometer.length > 0 && items.min_amount.length > 0 && items.max_amount.length > 0 && items.price_per_kilometer.length > 0) {
            setError('')
        }

    }, [items.from_kilometer, items.to_kilometer, items.max_amount, items.min_amount, items.price_per_kilometer])


    return (
        <Form fluid>
            <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                <Form.Group>
                    <Form.ControlLabel>Từ (km)</Form.ControlLabel>
                    <Form.Control value={items.from_kilometer} onChange={(value) => {
                        setItems({
                            ...items,
                            from_kilometer: value
                        })
                    }} required type='number' name="form_kilometer" />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Đến (km)</Form.ControlLabel>
                    <Form.Control value={items.to_kilometer} onChange={(value) => {
                        setItems({
                            ...items,
                            to_kilometer: value
                        })
                    }} required type='number' name="to_kilometer" />
                </Form.Group>
            </Stack>
            <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                <Form.Group>
                    <Form.ControlLabel>Giá tối thiểu (VND)</Form.ControlLabel>
                    <Form.Control value={items.min_amount} onChange={(value) => {
                        setItems({
                            ...items,
                            min_amount: value
                        })
                    }} required type='number' name="min_amount" />
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Giá tối đa (VND)</Form.ControlLabel>
                    <Form.Control value={items.max_amount} onChange={(value) => {
                        setItems({
                            ...items,
                            max_amount: value
                        })
                    }} required type='number' name="max_amount" />
                </Form.Group>
            </Stack>
            <Form.Group>
                <Form.ControlLabel>Đơn giá (VND/km)</Form.ControlLabel>
                <Form.Control value={items.price_per_kilometer} onChange={(value) => {
                    setItems({
                        ...items,
                        price_per_kilometer: value
                    })
                }} required type='number' name="price_per_kilometer" />
            </Form.Group>

            {error.length > 0 && (
                <Typography pb="1rem" color="red" fontSize={'14px'}>{error}</Typography>
            )}
            <Button appearance='primary' onClick={() => {
                if (items.from_kilometer.length <= 0 || items.to_kilometer.length <= 0 || items.min_amount.length <= 0 || items.max_amount.length <= 0 || items.price_per_kilometer.length <= 0) {
                    setError('Vui lòng điền đầy đủ thông tin')
                }
                else if (!error.length && items.from_kilometer.length && items.to_kilometer && items.max_amount && items.min_amount && items.price_per_kilometer) {
                    {
                        handleInputSubmit()
                    }
                }

            }}>Thêm 1 đơn giá</Button>
        </Form>
    )
}

const DrawerView = (props: any) => {
    const { boxSizeId, data, isLoading, onClose, ...rest } = props;
    const [open, setOpen] = React.useState(false)
    const [price, setPrice] = React.useState<Price>({
        apply_from: '',
        apply_to: '',
        name: '',
        priority: 0,
        note: '',
        items: []
    })
    const [error, setError] = React.useState('')

    const dispatch = useDispatch()


    const bearerToken = localStorage.getItem('sessionId')

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${bearerToken}`

    }

    useEffect(() => {
        console.log(price);

    }, [price])

    const handleCreateNewPriceTable = () => {
        setOpen(true)
    }
    const handleChangeApplyFrom = (date, dateString) => {
        setPrice({
            ...price,
            apply_from: dateString
        })
    }
    const handleChangeApplyTo = (date, dateString) => {
        setPrice({
            ...price,
            apply_to: dateString
        })
    }


    const handleViewItems = (values) => {
        console.log(values);
        setPrice({
            ...price,
            items: [
                ...price.items,
                values
            ]
        })
    }

    const handleCreatePrice = async () => {

        try {
            axios({
                method: 'post',
                url: `${url}/tariff/box-sizes/${boxSizeId}/prices`,
                headers: headers,
                data: JSON.stringify(price)
            }).then((res) => {
                console.log(res);
                setOpen(false)
                dispatch(increaseCount(1))
            }).catch((error) => {
                console.log(error);

            })
        } catch (error) {
            console.log(error);

        }
    }
    React.useEffect(() => {
        const date1 = new Date(price.apply_from)
        const date2 = new Date(price.apply_to)
        console.log(date1, date2);

        if (date1 >= date2) {

            setError('Ngày bắt đầu không thể trước ngày kết thúc')
        }
        else {
            setError('')
        }
    }, [price.apply_from, price.apply_to])


    return (
        <>
            <Drawer width={1000} title={` Bảng giá box ${boxSizeId} `} backdrop="static" size="lg" placement="right" onClose={onClose} {...rest}>



                <Button appearance="primary" onClick={handleCreateNewPriceTable}>
                    Thêm bảng giá
                </Button>
                <Table
                    loading={isLoading}
                    height={400}
                    data={data}
                    wordWrap='break-down'
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Column width={50} align="center" fixed>
                        <HeaderCell>Id</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>

                    <Column width={150} sortable>
                        <HeaderCell>Tên</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <Typography fontSize={'12px'} width="80%" color="black" >
                                        {rowData.attributes.name}
                                    </Typography>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column minWidth={100} sortable>
                        <HeaderCell>Ngày bắt đầu</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <Typography fontSize={'12px'} width="80%" color="black" >
                                        {rowData.attributes.apply_from.split('T')[0]}
                                    </Typography>
                                )
                            }}
                        </Cell>
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Ngày kết thúc</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <Typography fontSize={'12px'} width="80%" color="black" >
                                        {rowData.attributes.apply_to.split('T')[0]}
                                    </Typography>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={150}>
                        <HeaderCell>Ghi chú</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <Typography fontSize={'12px'} width="80%" color="black" >
                                        {rowData.attributes.note}
                                    </Typography>
                                )
                            }}
                        </Cell>
                    </Column>

                    <Column width={350}>
                        <HeaderCell> Thông số</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <Box >
                                        {rowData.attributes.items.map((item, i) => {
                                            return (
                                                <Tag key={i} color='processing'>Từ {item.fromKilometer}km đến {item.toKilometer}km, giá tối thiểu: {item.minAmount}VND, giá tối đa: {item.maxAmount}VND </Tag>
                                            )
                                        })}
                                    </Box>

                                )
                            }}
                        </Cell>
                    </Column>


                </Table>
                <Drawer title="Tạo mới một bảng giá" width={1000} open={open} onClose={() => setOpen(false)}>
                    <Form fluid>
                        <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                            <Form.Group>
                                <Form.ControlLabel>Ngày bắt đầu</Form.ControlLabel>
                                <DatePicker name="start_date" onChange={handleChangeApplyFrom} format={"YYYY/MM/DD"} style={{ width: 260 }} />

                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Ngày kết thúc</Form.ControlLabel>
                                <DatePicker onChange={handleChangeApplyTo} name="apply_to_date" format={"YYYY/MM/DD"} style={{ width: 260 }} />

                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Độ ưu tiên</Form.ControlLabel>
                                <Form.Control onChange={(value) => {
                                    setPrice({
                                        ...price,
                                        priority: value
                                    })
                                }} required type='number' name="priority" />
                            </Form.Group>
                        </Stack>
                        <Form.Group>
                            <Form.ControlLabel>Tên bảng giá</Form.ControlLabel>
                            <Form.Control onChange={(value) => {
                                setPrice({
                                    ...price,
                                    name: value
                                }
                                )
                            }} required type='' name="name" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Ghi chú</Form.ControlLabel>
                            <Form.Control required type='' onChange={(value) => {
                                setPrice({
                                    ...price,
                                    note: value
                                }
                                )
                            }} name="note" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Bảng giá</Form.ControlLabel>
                            <Box display={'flex'} flexWrap={'nowrap'} gap="0.5rem">
                                {price && (
                                    <>
                                        {price.items.map((item, i) => {
                                            return (
                                                <Tag key={i} color='processing'>Từ {item.from_kilometer}km đến {item.to_kilometer}km, giá tối thiểu: {item.min_amount}VND, giá tối đa: {item.max_amount}VND </Tag>

                                            )
                                        })}
                                    </>
                                )}
                            </Box>
                            <InputItems onInputChange={handleViewItems} />
                        </Form.Group>
                        {error.length > 0 && (
                            <Typography color="red" fontSize={'15px'}>{error}</Typography>
                        )}
                        <Modal.Footer>
                            <Button onClick={() => {
                                if (!error.length) {
                                    handleCreatePrice()
                                }

                            }} type='submit' appearance="primary" >
                                Xác nhận
                            </Button>
                            <Button onClick={() => { setOpen(false) }} appearance="subtle">
                                Bỏ qua
                            </Button>
                        </Modal.Footer>

                    </Form>
                </Drawer>

            </Drawer>

        </>
    );
};

export default DrawerView;
