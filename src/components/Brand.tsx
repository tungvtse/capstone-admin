import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.jpg'
import { Stack } from 'rsuite';

const Brand = props => {
  const role = localStorage.getItem('role')
  return (
    <Stack className="brand" {...props}>
      <Link to="/">

        <img src={logo} height={50} style={{ marginTop: 6 }} />
        <span style={{ marginLeft: 14, color: '#515151' }}>ChanhXe</span>
        <span style={{ color: '#3EBDE0' }}>{role === 'staff' ? 'Staff' : 'Admin'}</span>
      </Link>
    </Stack>
  );
};

export default Brand;
