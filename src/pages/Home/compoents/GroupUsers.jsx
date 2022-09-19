import axios from 'axios';
import { useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';
import GroupManage from './GroupManage';
import { User } from '../../App';
import { GroupInfo } from './Home';

const GroupUsers = ({ setGroupUsers, setGroupUserNames, setGroupUserEmails, isDebtChanged, isGroupChanged }) => {
  console.log('@groupUsers');
  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;
  let { gid } = currGroup;
  console.log(CurrUser.user);

  useEffect(() => {
    if (gid) {
      const token = localStorage.getItem('accessToken');
      const fetchUsers = async (gid) => {
        const { data } = await axios.get(`${constants.API_GET_GROUP_USERS}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('fetch data groupUsers:  ', data);

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
      };
      if (gid) {
        fetchUsers(gid);
      }
    }
  }, [isGroupChanged]);
  // currGroup,
  return (
    <div id="group-users">
      <div className="top_bar">
        <div>成員列表</div>
        <GroupManage.GroupManageButton setGroupUsers={setGroupUsers} setGroupUserNames={setGroupUserNames} setGroupUserEmails={setGroupUserEmails} />
      </div>
      <Balance id="balance" isDebtChanged={isDebtChanged} />
    </div>
  );
};

export default GroupUsers;
