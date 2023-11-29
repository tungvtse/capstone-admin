import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import DataTable from './DataTable';

const BoxSizeTable = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Danh sách box size</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Bảng</Breadcrumb.Item>
                        <Breadcrumb.Item active>Danh sách box size</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <DataTable />
        </Panel>
    );
};

export default BoxSizeTable;
