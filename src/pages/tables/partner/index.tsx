import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import DataTable from './DataTable';

const PartnerTable = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Danh sách đối tác</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Bảng</Breadcrumb.Item>
                        <Breadcrumb.Item active>Danh sách đối tác</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <DataTable />
        </Panel>
    );
};

export default PartnerTable;
