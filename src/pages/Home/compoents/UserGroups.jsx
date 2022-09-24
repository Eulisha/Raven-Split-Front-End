import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import CreateGroup from './CreateGroup';
import { User } from '../../App';
import { FaCrow } from 'react-icons/fa';
// CNavTitle, CBadge,  CSidebarToggler
import { CSidebar, CSidebarBrand, CSidebarNav, CNavGroup, CNavItem, CSidebarFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAccountLogout, cilPlus } from '@coreui/icons';
import Icons from '../../../global/Icons';

const UserGroups = ({ setCurrGroup, isGroupChanged, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged }) => {
  console.log('@UserGroups');

  let CurrUser = useContext(User);

  const [userGroups, setUserGroups] = useState([]);
  const [editingShow, setEditingShow] = useState(false);

  useEffect(() => {
    const fetchuserGroups = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios(`${constants.API_GET_USER_GROUPS}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setUserGroups: ', data.data);
        setUserGroups(data.data);
      } catch (err) {
        console.log(err.response);
        return alert(err.response);
      }
    };
    fetchuserGroups();
  }, [isGroupChanged]);

  return (
    <CSidebar id="group_area" position="fixed">
      <CSidebarBrand>
        <a className="logo" href={`${constants.HOST}/dashboard`}>
          <FaCrow size={40} />
          <div className="logo-title">Raven Split</div>
        </a>
      </CSidebarBrand>
      <CSidebarBrand>
        <div className="logo" href={`${constants.HOST}/dashboard`}>
          <Icons.UserIcon />
          <div className="logo-title">{CurrUser.user.name}</div>
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <CNavGroup toggler="Groups">
          {userGroups.map((group) => {
            if (group.type === '1') {
              return (
                <CNavItem href="#" key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name, type: group.type })}>
                  {group.name}
                </CNavItem>
              );
            }
          })}
          <CNavItem href="#" onClick={() => setEditingShow(true)}>
            <CIcon icon={cilPlus} style={{ marginRight: '10px' }} />
            新增群組
          </CNavItem>
        </CNavGroup>
        <CNavGroup toggler="Pairs">
          {userGroups.map((group) => {
            if (group.type === '2') {
              return (
                <CNavItem her="#" key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name, type: group.type })}>
                  {group.name}
                </CNavItem>
              );
            }
          })}
          <CNavItem href="#" onClick={() => setEditingShow(true)}>
            <CIcon icon={cilPlus} style={{ marginRight: '10px' }} />
            新增群組
          </CNavItem>
        </CNavGroup>
        <CNavGroup toggler="Group Buying">
          {userGroups.map((group) => {
            if (group.type === '3') {
              return (
                <CNavItem key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name, type: group.type })}>
                  {group.name}
                </CNavItem>
              );
            }
          })}
          <CNavItem href="#" onClick={() => setEditingShow(true)}>
            <CIcon icon={cilPlus} style={{ marginRight: '10px' }} />
            新增群組
          </CNavItem>
        </CNavGroup>
        {editingShow && (
          <div>
            <CreateGroup
              location="group_normal"
              editingShow={editingShow}
              setEditingShow={setEditingShow}
              setGroupUsers={setGroupUsers}
              setGroupUserNames={setGroupUserNames}
              setGroupUserEmails={setGroupUserEmails}
              setIsGroupChanged={setIsGroupChanged}
            />
          </div>
        )}
        <CSidebarFooter>
          <CNavItem
            href="/login"
            onClick={() => {
              localStorage.removeItem('accessToken');
            }}
          >
            <CIcon customClassName="nav-icon" icon={cilAccountLogout} />
            Logout
          </CNavItem>
        </CSidebarFooter>
      </CSidebarNav>
    </CSidebar>
  );
};
export default UserGroups;
