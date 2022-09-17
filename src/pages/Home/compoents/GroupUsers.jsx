import axios from 'axios';
import { useEffect } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';
import GroupManage from './GroupManage';

const GroupUsers = ({ gid, currGroup, groupUsers, groupUserNames, setGroupUsers, groupUserEmails, setGroupUserNames, setGroupUserEmails, isDebtChanged }) => {
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
        const userEmails = {}; //object of id-email key pair
        data.data.map((user) => {
          groupUsers.push(user.uid);
          userNames[user.uid] = user.name; //{1:Euli}
          userEmails[user.uid] = user.email; //{1:Euli}
        });
        setGroupUsers(groupUsers);
        setGroupUserNames(userNames);
        setGroupUserEmails(userEmails);
        console.log('groupUsers', groupUsers);
        console.log('groupUserNames', userNames);
      };
      fetchUsers(gid);
    }
  }, [currGroup]);
  return (
    <div id="group-users">
      <div className="top_bar">
        <div>成員列表</div>
        <GroupManage.GroupManageButton currGroup={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} groupUserEmails={groupUserEmails} />
      </div>
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
