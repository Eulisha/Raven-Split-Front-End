import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import Balance from './Balance';
import Debts from './Debts';
let gid = 123; //暫時寫死

const Group = () => {
  const [members, setMembers] = useState([]);
  const [isSettle, setIsSettle] = useState(false);
  useEffect(() => {
    const fetchMembers = async (gid) => {
      const { data } = await axios(`${constants.API_GET_GROUP_MEMBERS}${gid}`);
      console.log('fetch data group-members:  ', data);
      setMembers(data.data);
      console.log('set members:  ', data.data);
    };
    fetchMembers(gid);
  }, []);
  return (
    <div id="main">
      <div id="group">
        {gid} 成員列表
        <ul>
          {members.map((item) => {
            return <li key={item.uid}>{item.name}</li>;
          })}
        </ul>
      </div>
      <Debts
        key="debts"
        id="debts"
        gid={gid}
        members={members}
        isSettle={isSettle} //傳給debt跟detail
        setIsSettle={setIsSettle} //要傳給settle頁
      />
      <Balance key="balance" id="balance" gid={gid} isSettle={isSettle} />
    </div>
  );
};

export default Group;
