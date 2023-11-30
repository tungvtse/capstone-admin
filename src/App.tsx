import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { CustomProvider } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import locales from './locales';
import Frame from './components/Frame';
import DashboardPage from './pages/dashboard';
import Error404Page from './pages/authentication/404';
import Error403Page from './pages/authentication/403';
import Error500Page from './pages/authentication/500';
import Error503Page from './pages/authentication/503';

import SignInPage from './pages/authentication/sign-in';
import MembersPage from './pages/tables/members';
import FormBasicPage from './pages/forms/basic';
import FormWizardPage from './pages/forms/wizard';
import { adminNavs, staffNavs } from './config';
import LoginPage from './pages/signin';
import PartnerAccount from './pages/authentication/accountCreating/PartnerAccount';
import StaffAccount from './pages/authentication/accountCreating/StaffAccount';
import PartnerTable from './pages/tables/partner';
import StaffsTable from './pages/tables/staffs';
import HubTable from './pages/tables/hubs';
import OrderTable from './pages/tables/orders';
import ChangePassword from './pages/authentication/changePassword';
import BoxSizeTable from './pages/tables/boxsize';
import { RootState } from './store/store';
import { useSelector } from 'react-redux';


const App = () => {
  const [currentRole, setCurrentRole] = useState<string>('')

  const role = useSelector((state: RootState) => state.role.role)
  const localRole = localStorage.getItem('role')
  useEffect(() => {
    if (role === null && localRole) {
      setCurrentRole(localRole)
    }
    else if (role) {
      setCurrentRole(role)
    }
  }, [role])
  useEffect(() => {
    console.log(currentRole, localRole);

  }, [currentRole])



  return (
    <IntlProvider locale="en" messages={locales.en}>
      <CustomProvider locale={enGB}>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Frame navs={currentRole === 'admin' ? adminNavs : staffNavs} />}>
            <Route index element={<MembersPage />} />
            <Route path="transactions" element={<MembersPage />} />
            <Route path="sign-in" element={<SignInPage />} />
            {currentRole === 'admin' ? (<><Route path="create-partner-account" element={<PartnerAccount />} />
              <Route path="create-staff-account" element={<StaffAccount />} /></>) : (<></>)}
            <Route path="form-basic" element={<FormBasicPage />} />
            <Route path="form-wizard" element={<FormWizardPage />} />
            <Route path="orders" element={<OrderTable />} />
            <Route path="users" element={<MembersPage />} />
            <Route path="staffs" element={<StaffsTable />} />
            <Route path="partners" element={<PartnerTable />} />
            <Route path="hubs" element={<HubTable />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="box-size" element={<BoxSizeTable />} />
          </Route>
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </CustomProvider>
    </IntlProvider>
  );
};

export default App;
