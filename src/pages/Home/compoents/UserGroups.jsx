import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import CreateGroup from './CreateGroup';
import { User } from '../../App';
import { FaCrow } from 'react-icons/fa';
import { CSidebar, CSidebarBrand, CSidebarNav, CNavTitle, CNavItem, CSidebarFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAccountLogout, cilPlus } from '@coreui/icons';
import Icons from '../../../global/Icons';
import Swal from 'sweetalert2';

const UserGroups = ({ setCurrGroup, isGroupChanged, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged }) => {
  console.log('@UserGroups');

  let CurrUser = useContext(User);

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
        console.log(err.response.data.err);
        return Swal.fire({
          title: 'Error!',
          text: err.response.data.err,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      }
    };
    fetchuserGroups();
  }, [isGroupChanged]);

  const handleNavSelect = (e, group) => {
    console.log(group);
    setCurrGroup({ gid: group.gid, name: group.name, type: group.type });
    setSelected({ gid: group.gid });
  };

  return (
    <CSidebar id="group_area" position="fixed">
      <CSidebarBrand>
        <a className="logo" href={`${constants.HOST}/dashboard`}>
          <FaCrow size={40} />
          <div className="logo-title-brand">Raven Split</div>
        </a>
      </CSidebarBrand>
      <CSidebarBrand className="sidebar-user">
        <div className="logo" href={`${constants.HOST}/dashboard`}>
          <Icons.UserIcon />
          <div className="logo-title-user">{CurrUser.user.name}</div>
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <div className="sidebar-groups">
          <CNavTitle>Groups</CNavTitle>
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
