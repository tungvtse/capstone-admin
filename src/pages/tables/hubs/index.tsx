import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import DataTable from './DataTable';

const HubTable = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Danh sách trạm</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Bảng</Breadcrumb.Item>
                        <Breadcrumb.Item active>Danh sách trạm</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <DataTable />
        </Panel>
    );
};

export default HubTable;
