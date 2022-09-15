import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';
import Debts from './Debts';
const currUserId = 9; //FIXME:之後要用傳進來的
let gid = 100; //暫時寫死
// const groupUsers = [1, 2, 3, 4, 5]; //FIXME:之後要用傳進來的
// const userNames = { 1: 'Euli', 2: 'Tim', 3: 'Adam', 4: 'Kelvin', 5: 'Ellie' }; //FIXME:之後要用傳進來的

const Group = () => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupUserNames, setGroupUserNames] = useState({}); //{1:Euli}
  const [isSettle, setIsSettle] = useState(false);
  const [balances, setBalance] = useState([]);

  useEffect(() => {
    const fetchgroupUsers = async (gid) => {
      const { data } = await axios(`${constants.API_GET_GROUP_USERS}${gid}`);
      console.log('fetch data group-groupUsers:  ', data);
      const groupUsers = [];
      const groupUserNames = [];
      let userNames = {};
      data.data.map((user) => {
        groupUsers.push(user.uid);
        userNames[user.uid] = user.name;
      });
      setGroupUsers(groupUsers);
      setGroupUserNames(userNames);
      console.log('groupUsers', groupUsers);
      console.log('groupUserNames', groupUserNames);
    };
    fetchgroupUsers(gid);
  }, []);

  return (
    <div id="main">
      <div id="group">
        {gid} 成員列表
        <ul>
          {groupUsers.map((userId) => {
            return <li key={userId}>{groupUserNames[userId]}</li>;
          })}
        </ul>
      </div>
      <Debts
        key="debts"
        id="debts"
        currUserId={currUserId}
        gid={gid}
        groupUsers={groupUsers}
        groupUserNames={groupUserNames}
        isSettle={isSettle} //傳給debt跟detail
        setIsSettle={setIsSettle} //要傳給settle頁
      />
      <Balance key="balance" id="balance" currUserId={currUserId} gid={gid} groupUsers={groupUsers} groupUserNames={groupUserNames} balances={balances} setBalance={setBalance} />
    </div>
  );
};

export default Group;
