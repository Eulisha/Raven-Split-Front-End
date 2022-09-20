import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import { Nav } from 'react-bootstrap';
import GroupManage from './GroupManage';
import { User } from '../../App';
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import SimpleBar from 'simplebar-react';

const UserGroups = ({ setCurrGroup, setGroupUsers, setGroupUserNames, setGroupUserEmails, isGroupChanged, setIsGroupChanged }) => {
  console.log('@UserGroups');
  let CurrUser = useContext(User);
  console.log('curruser.user', CurrUser.user);

  const [userGroups, setUserGroups] = useState([]);
  console.log('userGroups', userGroups);

  useEffect(() => {
    const fetchuserGroups = async () => {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios(`${constants.API_GET_USER_GROUPS}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('fetch data userGroups:  ', data);
      setUserGroups(data.data);
    };
    fetchuserGroups();
  }, [isGroupChanged]);

  return (
    <CSidebar position="fixed">
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" height={35} />
        <CIcon className="sidebar-brand-narrow" height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar></SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" />

      <div id="group_area">
        <div id="group_normal_type">
          My Groups
          <div className="top_bar">
            <div>Groups</div>
          </div>
          <GroupManage.GroupManageButton
            location="group_normal"
            setGroupUsers={setGroupUsers}
            setGroupUserNames={setGroupUserNames}
            setGroupUserEmails={setGroupUserEmails}
            setIsGroupChanged={setIsGroupChanged}
          />
          <Nav defaultActiveKey="/home" className="flex-column">
            {userGroups.map((group) => {
              if (group.type === '1') {
                return (
                  <Nav.Link key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name, type: group.type })}>
                    {group.name}
                  </Nav.Link>
                  // <button key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name })}>
                  //   {group.name}
                  // </button>
                );
              }
            })}
          </Nav>
        </div>
        <div id="group_pair_type">
          <div className="top_bar">
            <div>Pair</div>
          </div>
          <GroupManage.GroupManageButton
            location="group_pair"
            setGroupUsers={setGroupUsers}
            setGroupUserNames={setGroupUserNames}
            setGroupUserEmails={setGroupUserEmails}
            setIsGroupChanged={setIsGroupChanged}
          />
          <Nav defaultActiveKey="/home" className="flex-column">
            {userGroups.map((group) => {
              if (group.type === '2') {
                return (
                  <Nav.Link key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name, type: group.type })}>
                    {group.name}
                  </Nav.Link>
                );
              }
            })}
          </Nav>
        </div>
        <div id="group_buying_type">
          <div className="top_bar">
            <div>Group Buying</div>
          </div>
          <GroupManage.GroupManageButton
            location="group_buying"
            setGroupUsers={setGroupUsers}
            setGroupUserNames={setGroupUserNames}
            setGroupUserEmails={setGroupUserEmails}
            setIsGroupChanged={setIsGroupChanged}
          />
          <Nav defaultActiveKey="/home" className="flex-column">
            {userGroups.map((group) => {
              if (group.type === '3') {
                return (
                  <Nav.Link key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name, type: group.type })}>
                    {group.name}
                  </Nav.Link>
                );
              }
            })}
          </Nav>
        </div>
      </div>
    </CSidebar>
  );
};
export default UserGroups;
