import axios from 'axios';
import { useEffect } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';

const GroupUsers = ({ gid, currGroup, groupUserNames, setGroupUsers, setGroupUserNames, isDebtChanged }) => {
  console.log('@groupuser log currgroup', currGroup, 'gid', currGroup.gid, currGroup.name);
  useEffect(() => {
    if (gid) {
      const token = localStorage.getItem('accessToken');
      const fetchUsers = async (gid) => {
        const { data } = await axios.get(`${constants.API_GET_GROUP_USERS}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('fetch data group-groupUsers:  ', data);

        //整理成適合的格式
        const groupUsers = []; //array of Ids of groupUsers
        const userNames = {}; //object of id-name key pair
        data.data.map((user) => {
          groupUsers.push(user.uid);
          userNames[user.uid] = user.name; //{1:Euli}
        });
        setGroupUsers(groupUsers);
        setGroupUserNames(userNames);
        console.log('groupUsers', groupUsers);
        console.log('groupUserNames', userNames);
      };
      fetchUsers(gid);
    }
  }, [currGroup]);
  return (
    <div id="group-users">
      <div>成員列表</div>
      {/* <ul>
        {groupUsers.map((item) => {
          return <li key={item.uid}>{item.name}</li>;
        })}
      </ul> */}
      <Balance id="balance" gid={gid} groupUserNames={groupUserNames} isDebtChanged={isDebtChanged} />
    </div>
  );
};

export default GroupUsers;
