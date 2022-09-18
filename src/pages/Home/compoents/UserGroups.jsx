import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import { Nav } from 'react-bootstrap';
import GroupManage from './GroupManage';

const UserGroups = ({ setCurrGroup, setGroupUsers, setGroupUserNames, setGroupUserEmails, isGroupChanged, setIsGroupChanged }) => {
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
  }, [isGroupChanged]);

  return (
    <div id="group_area">
      <div id="group_normal_type">
        My Groups
        <GroupManage.GroupManageButton
          setGroupUsers={setGroupUsers}
          setGroupUserNames={setGroupUserNames}
          setGroupUserEmails={setGroupUserEmails}
          setIsGroupChanged={setIsGroupChanged}
        />
        <div className="top_bar">
          <div>Groups</div>
        </div>
        {/* <ul id="group_list"> */}
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
        {/* </ul> */}
      </div>
      <div id="group_pair_type">
        <div className="top_bar">
          <div>Pair</div>
        </div>
        {/* <ul id="group_list"> */}
        <Nav defaultActiveKey="/home" className="flex-column">
          {userGroups.map((group) => {
            if (group.type === '2') {
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
        {/* </ul> */}
      </div>
      <div id="group_buying_type">
        <div className="top_bar">
          <div>Group Buying</div>
        </div>
        {/* <ul id="group_list"> */}
        <Nav defaultActiveKey="/home" className="flex-column">
          {userGroups.map((group) => {
            if (group.type === '3') {
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
        {/* </ul> */}
      </div>
    </div>
  );
};
export default UserGroups;
