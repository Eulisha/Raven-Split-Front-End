import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import CreateGroup from './CreateGroup';
import { User } from '../../App';
import { GroupInfo } from './Home';
import { FaCrow } from 'react-icons/fa';
import { CSidebar, CSidebarBrand, CSidebarNav, CNavItem, CSidebarFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAccountLogout, cilPlus } from '@coreui/icons';
import Icons from '../../../global/Icons';
import Swal from 'sweetalert2';

const UserGroups = ({ isGroupChanged, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged }) => {
  console.log('@UserGroups');

  //Context
  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, setCurrGroup } = CurrGroupInfo;

  const [userGroups, setUserGroups] = useState([]);
  const [editingShow, setEditingShow] = useState(false);
  const [selected, setSelected] = useState({});

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
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    fetchuserGroups();
  }, [isGroupChanged]);

  useEffect(() => {
    setSelected({ gid: currGroup.gid });
  }, [currGroup]);

  const handleNavSelect = (e, group) => {
    console.log(group);
    setCurrGroup({ gid: group.gid, name: group.name, type: group.type });
    setSelected({ gid: group.gid });
  };

  return (
    <CSidebar className="group_area" position="fixed">
      <CSidebarBrand>
        <a className="logo" href={`${constants.HOST}/dashboard`}>
          <FaCrow size={40} />
          <div className="logo-title-brand">Raven Split</div>
        </a>
      </CSidebarBrand>
      <hr className="nav-hr" />
      <CSidebarBrand className="sidebar-user">
        <div className="logo" href={`${constants.HOST}/dashboard`}>
          <Icons.UserIcon />
          <div className="logo-title-user">{CurrUser.user.name}</div>
        </div>
      </CSidebarBrand>
      <hr className="nav-hr" />
      <CSidebarBrand className="sidebar-group-title">My Groups</CSidebarBrand>
      <hr className="nav-hr" />
      <CSidebarNav>
        <div className="sidebar-groups">
          {userGroups.map((group) => {
            if (group.type === '1') {
              return (
                <CNavItem href="#" key={group.gid} className={selected.gid === group.gid ? 'sidebar-group active' : 'sidebar-group'} onClick={(e) => handleNavSelect(e, group)}>
                  {group.name}
                </CNavItem>
              );
            }
          })}
          <button className="add-group-btn" onClick={() => setEditingShow(true)}>
            <CIcon icon={cilPlus} style={{ marginRight: '10px' }} />
            Create Group
          </button>
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
        </div>
        <hr className="nav-hr" />
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
