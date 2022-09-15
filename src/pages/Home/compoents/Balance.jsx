import { useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';

const Balance = ({ gid, groupUserNames, isSettle, balances, setBalance }) => {
  useEffect(() => {
    const fetchBalance = async (gid) => {
      try {
        const { data } = await axios.get(`${constants.API_GET_BALANCES}${gid}`);
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
