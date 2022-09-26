import axios from 'axios';
import { useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';
// import { User } from '../../App';
import { GroupInfo } from './Home';
import Swal from 'sweetalert2';
// import { RiUserSettingsLine } from 'react-icons/ri';
{
  /* <RiUserSettingsLine style={{ marginLeft: '10px' }} /> */
}

const GroupUsers = ({ setGroupUsers, setGroupUserNames, setGroupUserEmails, isDebtChanged, isGroupChanged, setIsDebtChanged }) => {
  console.log('@GroupUsers');
  // let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;
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
        console.log('BACKEND for setGroup..:  ', data.data);

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
    if (gid) {
      fetchUsers(gid);
    }
  }, [currGroup, isGroupChanged]);

  return (
    <div id="group-users">
      <div className="group-users-top-bar">
        <div> Group Balance</div>
      </div>
      <Balance id="balance" isDebtChanged={isDebtChanged} setIsDebtChanged={setIsDebtChanged} />
    </div>
  );
};

export default GroupUsers;
