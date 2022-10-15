import axios from 'axios';
import { useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';
import { GroupInfo } from './Home';
import Swal from 'sweetalert2';

const GroupUsers = ({ isDebtChanged, setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, setGroupUsers, setGroupUserNames, setGroupUserEmails, isGroupChanged } = CurrGroupInfo;
  let { gid } = currGroup;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const fetchUsers = async (gid) => {
      try {
        const { data } = await axios.get(`${constants.API_GET_GROUP_USERS}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        //整理成適合的格式
        const groupUsers = []; //array of Ids of groupUsers
        const userNames = {}; //object of id-name key pair
        const userEmails = {}; //object of id-email key pair
        //object with uid as key
        data.data.map((user) => {
          groupUsers.push(user.uid);
          userNames[user.uid] = user.name;
          userEmails[user.uid] = user.email;
        });
        setGroupUsers(groupUsers);
        setGroupUserNames(userNames);
        setGroupUserEmails(userEmails);
      } catch (err) {
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Oops!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    if (gid) {
      fetchUsers(gid);
    }
  }, [currGroup, isGroupChanged]);

  return (
    <div id="group-users">
      <Balance id="balance" isDebtChanged={isDebtChanged} setIsDebtChanged={setIsDebtChanged} />
    </div>
  );
};

export default GroupUsers;
