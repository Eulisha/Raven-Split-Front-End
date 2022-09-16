import { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';

const Balance = ({ gid, groupUserNames, isSettle }) => {
  const [balances, setBalance] = useState([]);
  useEffect(() => {
    console.log('balance gid', gid);
    const fetchBalance = async (gid) => {
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await axios.get(`${constants.API_GET_BALANCES}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('fetch data balance: ', data);
        setBalance(data.data);
        console.log('set balance:', data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBalance(gid);
  }, [isSettle]);

  return (
    <div id="balance">
      {balances.map((balance) => {
        if (balance.borrower !== balance.lender)
          return (
            <div key={balance.id}>
              <li>
                {groupUserNames[balance.borrower]} 欠 {groupUserNames[balance.lender]} ${balance.amount}
              </li>
            </div>
          );
      })}
    </div>
  );
};

export default Balance;
