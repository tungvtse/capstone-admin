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
import axios from 'axios';
import { url } from '../../../url'
import { Box, Typography } from '@mui/material';
import BoxPartner from './BoxPartner';
import { useDispatch } from 'react-redux';
import { setPartnerCount } from '@/store/counteSlice';


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

    const getPartnerList = async () => {
        setIsLoading(true)
        try {
            axios({

                method: 'get',
                url: `${url}/account/partners`,
                headers: headers
            }).then((res) => {
                console.log(res.data.data);
                setData(res.data.data)
                setIsLoading(false)
                dispatch(setPartnerCount({
                    partnerCount: res.data.data.length
                }))
                localStorage.setItem('partnerCount', res.data.data.length)

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
        getPartnerList()
    }, [])


    return (
        <>
            {data && (
                <Box width={"80%"} ml="10%" display={'flex'} flexDirection={'column'} gap="0.5rem">
                    {data.map((item) => {
                        return (
                            <BoxPartner create_at={item.attributes.created_at} id={item.attributes.id} phone={item.attributes.phone} name={item.attributes.name} />
                        )
                    })}
                </Box>
            )}

            <DrawerView open={showDrawer} onClose={() => setShowDrawer(false)} />
        </>
    );
};

export default DataTable;
