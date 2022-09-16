import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';

const UserGroups = ({ setCurrGroup }) => {
  // const UserGroups = () => {
  const [userGroups, setUserGroups] = useState([]);

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

    console.log('aaa');
  }, []);

  return (
    <div>
      Groups
      <ul>
        {userGroups.map((group) => {
          return (
            <button key={group.gid} onClick={() => setCurrGroup({ gid: group.gid, name: group.name })}>
              {group.name}
            </button>
          );
        })}
      </ul>
    </div>
  );
};

export default UserGroups;
