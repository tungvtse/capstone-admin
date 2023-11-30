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
import { NameCell, ImageCell, CheckCell, ActionCell } from './Cells';
import axios from 'axios';
import { url } from '../../../url'
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUserCount } from '@/store/counteSlice';
import { Tag } from "antd"


const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

type Partner = {
  id: number;
  username: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE"
}



const DataTable = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch()



  const filteredData = () => {
    const filtered = data.filter((item) => item.attributes.name.includes(searchKeyword));

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



  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const bearerToken = localStorage.getItem('sessionId')
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${bearerToken}`

  }

  const getUserList = async () => {
    setIsLoading(true)
    try {
      axios({

        method: 'get',
        url: `${url}/account/customers`,
        headers: headers
      }).then((res) => {
        console.log(res.data.data);
        setData(res.data.data)
        setIsLoading(false)
        dispatch(setUserCount({
          userCount: res.data.data.length
        }))
        localStorage.setItem('userCount', res.data.data.length)

      }).catch((error) => {
        console.log(error);
        setIsLoading(false)

      })
    } catch (error) {
      console.log(error);
      setIsLoading(false)

    }
  }

  React.useEffect(() => {
    getUserList()
  }, [])


  return (
    <>
      <Stack className="table-toolbar" justifyContent="space-between">


        <Stack spacing={6}>

          <InputGroup inside>
            <Input placeholder="Tìm kiếm theo tên" value={searchKeyword} onChange={setSearchKeyword} />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </Stack>
      </Stack>

      <Table
        height={Math.max(getHeight(window) - 200, 450)}
        data={filteredData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={isLoading}
      >
        <Column width={100} align="center" fixed>
          <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Id</HeaderCell>
          <Cell style={{
            alignItems: 'center',
            paddingTop: ''
          }} >
            {rowData => {

              return (<Typography fontSize={'14px'} width="80%" color="#575757" >
                {rowData.id}
              </Typography>)
            }}
          </Cell>
        </Column>


        <Column width={200} sortable>
          <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Email</HeaderCell>
          <Cell style={{
            alignItems: 'center',
            paddingTop: ''
          }} >
            {rowData => {

              return (<Typography fontSize={'14px'} width="80%" color="#575757" >
                {rowData.attributes.email}
              </Typography>)
            }}
          </Cell>
        </Column>
        <Column width={200} sortable>
          <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Tên khách hàng </HeaderCell>
          <Cell style={{
            alignItems: 'center',
            paddingTop: ''
          }} >
            {rowData => {

              return (<Typography fontSize={'14px'} width="80%" color="#575757" >
                {rowData.attributes.name}
              </Typography>)
            }}
          </Cell>
        </Column>

        <Column width={200}>
          <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Số điện thoại</HeaderCell>
          <Cell style={{
            alignItems: 'center',
            paddingTop: ''
          }} >
            {rowData => {

              return (<Typography fontSize={'14px'} width="80%" color="#575757" >
                {rowData.attributes.phone}
              </Typography>)
            }}
          </Cell>
        </Column>
        <Column width={100}>
          <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>Trạng thái</HeaderCell>
          <Cell style={{
            paddingTop: ''
          }} >
            {rowData => {

              return (<Tag color={rowData.attributes.status === 1 ? "success" : "error"}>
                {rowData.attributes.status === 1 ? "ACTIVE" : "INACTIVE"}
              </Tag>)
            }}
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell style={{ color: '#373d58', fontWeight: 'bold', fontSize: '14px' }}>
            Cập nhật trạng thái tài khoản
          </HeaderCell>
          <ActionCell dataKey="id" />
        </Column>
      </Table>

      <DrawerView open={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default DataTable;
