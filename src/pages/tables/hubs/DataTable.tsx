import React, { useState } from 'react';
import {
    Input,
    InputGroup,
    Table,
    Button,
    DOMHelper,
    Progress,
    Checkbox,
    Stack,
    SelectPicker
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import MoreIcon from '@rsuite/icons/legacy/More';
import DrawerView from './DrawerView';
import { mockUsers } from '@/data/mock';
import { NameCell, ImageCell, CheckCell, ActionCell } from '../Cells';


const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

type Hub = {
    id: number;
    name: string;
    address: string;
    long: number;
    lat: number;
}

const data: Hub[] = [
    {
        id: 1,
        name: 'thành bưởi',
        address: '144namhoa',
        long: 24732894,
        lat: 24732894
    },
    {
        id: 2,
        name: 'thành bưởi',
        address: '144namhoa',
        long: 24732894,
        lat: 24732894
    },
]

const DataTable = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState('');

    let checked = false;
    let indeterminate = false;

    if (checkedKeys.length === data.length) {
        checked = true;
    } else if (checkedKeys.length === 0) {
        checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
        indeterminate = true;
    }

    const filteredData = () => {
        const filtered = data.filter((item) => item.name.includes(searchKeyword));

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

    const handleCheckAll = (_value, checked) => {
        const keys = checked ? data.map(item => item.id) : [];
        setCheckedKeys(keys);
    };
    const handleCheck = (value, checked) => {
        const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
        setCheckedKeys(keys);
    };

    const handleSortColumn = (sortColumn, sortType) => {
        setSortColumn(sortColumn);
        setSortType(sortType);
    };



    return (
        <>
            <Stack className="table-toolbar" justifyContent="space-between">


                <Stack spacing={6}>

                    <InputGroup inside>
                        <Input placeholder="Tìm kiếm theo tên trạm" value={searchKeyword} onChange={setSearchKeyword} />
                        <InputGroup.Addon>
                            <SearchIcon />
                        </InputGroup.Addon>
                    </InputGroup>
                </Stack>
            </Stack>

            <Table
                height={Math.max(getHeight(window) - 200, 400)}
                data={filteredData()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
            >
                <Column width={50} align="center" fixed>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={50} fixed>
                    <HeaderCell style={{ padding: 0 }}>
                        <div style={{ lineHeight: '40px' }}>
                            <Checkbox
                                inline
                                checked={checked}
                                indeterminate={indeterminate}
                                onChange={handleCheckAll}
                            />
                        </div>
                    </HeaderCell>
                    <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
                </Column>
                <Column width={200} sortable>
                    <HeaderCell>Tên trạm</HeaderCell>
                    <Cell dataKey='name' />
                </Column>
                <Column width={200} sortable>
                    <HeaderCell>Địa chỉ</HeaderCell>
                    <Cell dataKey='address' />
                </Column>

                <Column width={300}>
                    <HeaderCell>Longitude</HeaderCell>
                    <Cell dataKey='long' />
                </Column>
                <Column width={100}>
                    <HeaderCell>Latitude</HeaderCell>
                    <Cell dataKey='lat' />
                </Column>

                <Column width={120}>
                    <HeaderCell>
                        <MoreIcon />
                    </HeaderCell>
                    <ActionCell dataKey="id" />
                </Column>
            </Table>

            <DrawerView open={showDrawer} onClose={() => setShowDrawer(false)} />
        </>
    );
};

export default DataTable;
