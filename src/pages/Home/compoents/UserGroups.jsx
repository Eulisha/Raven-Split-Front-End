import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import { Nav } from 'react-bootstrap';
import GroupManage from './GroupManage';

const UserGroups = ({ setCurrGroup }) => {
  console.log('at usergroups');
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
      console.log('fetch data user-groups:  ', data);
      setUserGroups(data.data);
    };
    fetchuserGroups();
  }, []);

  return (
    <div id="group_area">
      <div className="top_bar">
        <div>Groups</div>
        <GroupManage.GroupManageButton />
      </div>
      {/* <ul id="group_list"> */}
      <Nav defaultActiveKey="/home" className="flex-column">
        {userGroups.map((group) => {
          return (
            <Nav.Link key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name })}>
              {group.name}
            </Nav.Link>
            // <button key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name })}>
            //   {group.name}
            // </button>
          );
        })}
      </Nav>
      {/* </ul> */}
    </div>
  );
};
export default UserGroups;
