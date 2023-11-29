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
    SelectPicker,
    Modal,
    Form
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import DrawerView from './DrawerView';
import { mockUsers } from '@/data/mock';
import { NameCell, ImageCell, CheckCell, ActionCell } from '../Cells';
import axios from 'axios';
import { url } from '../../../url'
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { notification } from 'antd';

type NotificationType = 'success' | 'error'



const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

type BoxSize = {
    id: string;
    type: string;
    attributes: {
        max_length: number,
        max_width: number,
        max_height: number,
        max_weight: number
    }
}

const DataTable = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedId, setSelectedId] = useState('')
    const [currentTable, setCurrentTable] = useState<BoxSize[]>([])
    const [currentDataView, setCurrentDataView] = useState<any[]>();
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [open, setOpen] = useState(false)
    const [length, setLength] = useState<number>()
    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [weight, setWeight] = useState<number>()
    const [error, setError] = useState('')
    const [visible, setVisible] = React.useState(false);
    const [api, contextHolder] = notification.useNotification()


    const openNotificationWithIcon = (type: NotificationType) => {

        api[type]({
            message: 'Tạo mới 1 box size',
            description: type === `success` ? `Tạo mới box size thành công` : ""
        })
    }


    const handleSortColumn = (sortColumn, sortType) => {
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    useEffect(() => {
        if (weight && height && length && width) {
            setError('')
        }
    }, [weight, height, width, length])

    const filteredData = () => {
        const filtered = currentTable.filter(item => {
            if (!item.id.includes(searchKeyword)) {
                return false;
            }



            return true;
        });

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
    const bearerToken = localStorage.getItem('sessionId')

    const convertWeight = (value: number) => {
        if (value < 1000) {
            return value + "g"
        }
        else {
            return Math.round(value / 1000) + "kg"
        }
    }

    const convertLength = (value: number) => {
        if (value < 1000) {
            return value + "mm"
        }
        else return (value / 1000).toFixed(2) + "m"
    }
    console.log(bearerToken);

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${bearerToken}`

    }

    const getBoxSizeList = async () => {
        setIsLoading(true)
        const params = {
            page: 1,
            perPage: 100
        }
        try {
            axios({
                method: "get",
                url: `${url}/tariff/box-sizes`,
                headers: headers,
                params: params
            }).then((res) => {
                console.log(res.data.data);
                setCurrentTable(res.data.data)
                setIsLoading(false)
            }).catch((error) => {
                console.log(error);
                setIsLoading(true)

            })
        } catch (error) {
            console.log(error);
            setIsLoading(true)

        }
    }

    const getBoxSizeById = async (id: string) => {
        setIsLoadingDetail(true)
        try {
            axios({
                method: 'get',
                url: `${url}/tariff/box-sizes/${id}/prices`,
                headers: headers,
            }).then((res) => {
                console.log(res);
                setCurrentDataView(res.data.data)
                setIsLoadingDetail(false)

            }).catch((error) => {
                console.log(error);

            })
        } catch (error) {
            console.log(error);

        }
    }

    React.useEffect(() => {
        getBoxSizeList()
    }, [])

    const count = useSelector((state: RootState) => state.count.count)
    React.useEffect(() => {
        if (selectedId.length > 0) {
            getBoxSizeById(selectedId)
            console.log(count, selectedId);

        }

    }, [count, selectedId])


    const handleRowClick = (rowData, event) => {
        console.log(rowData);
        getBoxSizeById(rowData.id)
        handleViewBoxSizeDetail(rowData.id)
    }

    const handleViewBoxSizeDetail = (id) => {
        setShowDrawer(true)
        setSelectedId(id)
    }

    const handleCrateBoxSize = () => {
        const values = {
            max_height: height,
            max_weight: weight,
            max_length: length,
            max_width: width,
        }
        console.log(headers);

        try {
            axios({
                method: "post",
                url: `${url}/tariff/box-sizes`,
                headers: headers,
                data: JSON.stringify(values)
            }).then((res) => {
                console.log(res);
                openNotificationWithIcon("success")
                setOpen(false);
                getBoxSizeList()

            }).catch((error) => {
                console.log(error);

            })
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <>
            {contextHolder}
            <Stack className="table-toolbar" justifyContent="space-between">
                <Button appearance="primary" onClick={() => { setOpen(true) }}>
                    Thêm 1 box size
                </Button>

                <Stack spacing={6}>
                    {/* <SelectPicker
            label="Rating"
            data={ratingList}
            searchable={false}
            value={rating}
            onChange={setRating}
          /> */}
                    <InputGroup inside>
                        <Input placeholder="Tìm kiếm theo Id" value={searchKeyword} onChange={setSearchKeyword} />
                        <InputGroup.Addon>
                            <SearchIcon />
                        </InputGroup.Addon>
                    </InputGroup>
                </Stack>
            </Stack>

            <Table
                height={Math.max(getHeight(window) - 100, 450)}
                data={filteredData()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                onRowClick={handleRowClick}
                loading={isLoading}
            >
                <Column width={150} align="center" fixed>
                    <HeaderCell style={{ fontSize: '16px', color: '#373d58', fontWeight: 'bold' }}>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>


                <Column width={200} sortable>
                    <HeaderCell style={{ fontSize: '16px', color: '#373d58', fontWeight: 'bold' }}>Chiều dài</HeaderCell>
                    <Cell>
                        {rowData => {
                            return (
                                <Typography fontSize={'16px'} color="#575757" width="80%"  >
                                    {convertLength(rowData.attributes.max_length)}
                                </Typography>
                            )
                        }}
                    </Cell>
                </Column>

                <Column width={200}>
                    <HeaderCell style={{ fontSize: '16px', color: '#373d58', fontWeight: 'bold' }}>Chiều rộng</HeaderCell>
                    <Cell>
                        {rowData => {
                            return (
                                <Typography fontSize={'16px'} color="#575757" width="80%"  >
                                    {convertLength(rowData.attributes.max_width)}
                                </Typography>
                            )
                        }}
                    </Cell>
                </Column>
                <Column width={200}>
                    <HeaderCell style={{ fontSize: '16px', color: '#373d58', fontWeight: 'bold' }}>Chiều cao</HeaderCell>
                    <Cell>
                        {rowData => {
                            return (
                                <Typography fontSize={'16px'} color="#575757" width="80%"  >
                                    {convertLength(rowData.attributes.max_height)}
                                </Typography>
                            )
                        }}
                    </Cell>
                </Column>
                <Column width={200}>
                    <HeaderCell style={{ fontSize: '16px', color: '#373d58', fontWeight: 'bold' }}>Cân nặng</HeaderCell>
                    <Cell>
                        {rowData => {
                            return (
                                <Typography fontSize={'16px'} color="#575757" width="80%"  >
                                    {convertWeight(rowData.attributes.max_weight)}
                                </Typography>
                            )
                        }}
                    </Cell>
                </Column>


            </Table>
            <Modal size={'sm'} open={open} onClose={() => { setOpen(false) }}>
                <Modal.Header>
                    <Modal.Title>Tạo mới box size</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
                            <Form.Group>
                                <Form.ControlLabel>Cân nặng (g)</Form.ControlLabel>
                                <Form.Control required type='number' onChange={(value: any) => { setWeight(value) }} name="max_weight" style={{ width: 200 }} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Chiều cao (mm)</Form.ControlLabel>
                                <Form.Control required type='number' onChange={(value: any) => { setHeight(value) }} name="max_height" style={{ width: 200 }} />
                            </Form.Group>
                        </Stack>
                        <Form.Group>
                            <Form.ControlLabel>Chiều dài (mm)</Form.ControlLabel>
                            <Form.Control required type='number' onChange={(value: any) => { setLength(value) }} name="max_length" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Chiều rộng (mm)</Form.ControlLabel>
                            <Form.Control required type='number' onChange={(value: any) => { setWidth(value) }} name="max_width" />
                        </Form.Group>

                        {error.length > 0 && (<Typography color="red">{error}</Typography>)}

                        <Modal.Footer>
                            <Button appearance="primary" onClick={() => {
                                if (weight && length && height && width) {
                                    handleCrateBoxSize()
                                }
                                else {
                                    setError("Vui lòng điền đầy đủ thông tin")
                                }
                            }}>
                                Xác nhận
                            </Button>
                            <Button onClick={() => { setOpen(false) }} appearance="subtle">
                                Bỏ qua
                            </Button>
                        </Modal.Footer>

                    </Form>
                </Modal.Body>
            </Modal>
            <DrawerView boxSizeId={selectedId} isLoading={isLoadingDetail} open={showDrawer} data={currentDataView} onClose={() => setShowDrawer(false)} />
        </>
    );
};

export default DataTable;
