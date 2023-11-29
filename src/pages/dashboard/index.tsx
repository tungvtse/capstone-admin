import React, { useEffect } from 'react';
import { Panel } from 'rsuite';
import Dashboard from './Dashboard';
import Copyright from '@/components/Copyright';
import PageToolbar from '@/components/PageToolbar';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId === null) {
      navigate("/login")
    }
  }, [])
  return (
    <Panel header={<h3 className="title">Dashboard</h3>}>
      <Dashboard />
      <Copyright />
    </Panel>
  );
};

export default Page;
