import React from 'react';
import { Icon } from '@rsuite/icons';
import { VscTable, VscCalendar } from 'react-icons/vsc';
import { MdFingerprint, MdDashboard, MdModeEditOutline } from 'react-icons/md';
import CubesIcon from '@rsuite/icons/legacy/Cubes';
import { RiFileList3Line, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { AiOutlineSchedule } from 'react-icons/ai'
import { PiUsers } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { MdRememberMe } from "react-icons/md";
import { BiHeadphone } from "react-icons/bi";
import { FaBox } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { RootState } from './store/store';



export const adminNavs = [



  // {
  //   eventKey: 'transactions',
  //   icon: <Icon as={RiMoneyDollarCircleLine} />,
  //   title: 'Danh sách giao dịch',
  //   to: '/transactions'
  // },
  {
    eventKey: 'users',
    icon: <Icon as={PiUsers} />,
    title: 'Danh sách người dùng',
    to: '/users'
  },
  // {
  //   eventKey: 'hubs',
  //   icon: <Icon as={FaLocationDot} />,
  //   title: 'Danh sách trạm',
  //   to: '/hubs'
  // },
  {
    eventKey: 'partners',
    icon: <Icon as={MdRememberMe} />,
    title: 'Danh sách đối tác',
    to: '/partners'
  },

  {
    eventKey: 'orders',
    icon: <Icon as={RiFileList3Line} />,
    title: 'Danh sách đơn hàng',
    to: '/orders'
  },
  {
    eventKey: 'box-size',
    title: 'Danh sách box size',
    icon: <Icon as={FaBox} />,

    to: '/box-size',
  },
  {
    eventKey: 'staffs',
    icon: <Icon as={BiHeadphone} />,
    title: 'Danh sách nhân viên',
    to: '/staffs'
  },
  {
    eventKey: 'create-partner-account',
    title: 'Tạo tài khoản partner',
    icon: <Icon as={MdFingerprint} />,

    to: '/create-partner-account',
  },
  {
    eventKey: 'create-staff-account',
    title: 'Tạo tài khoản staff',
    icon: <Icon as={MdFingerprint} />,

    to: '/create-staff-account',
  },

]

export const staffNavs = [



  // {
  //   eventKey: 'transactions',
  //   icon: <Icon as={RiMoneyDollarCircleLine} />,
  //   title: 'Danh sách giao dịch',
  //   to: '/transactions'
  // },
  {
    eventKey: 'users',
    icon: <Icon as={PiUsers} />,
    title: 'Danh sách người dùng',
    to: '/users'
  },
  // {
  //   eventKey: 'hubs',
  //   icon: <Icon as={FaLocationDot} />,
  //   title: 'Danh sách trạm',
  //   to: '/hubs'
  // },
  {
    eventKey: 'partners',
    icon: <Icon as={MdRememberMe} />,
    title: 'Danh sách đối tác',
    to: '/partners'
  },

  {
    eventKey: 'orders',
    icon: <Icon as={RiFileList3Line} />,
    title: 'Danh sách đơn hàng',
    to: '/orders'
  },
  // {
  //   eventKey: 'box-size',
  //   title: 'Danh sách box size',
  //   icon: <Icon as={FaBox} />,

  //   to: '/box-size',
  // },


];
