import { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import { ListGroup } from 'react-bootstrap';

const Balance = ({ gid, groupUserNames, currGroup, isDebtChanged }) => {
  console.log('@balance');
  const [balances, setBalance] = useState([]);
  useEffect(() => {
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
  }, [currGroup, isDebtChanged]);

  return (
    <div id="balance">
      <ListGroup>
        {balances.map((balance) => {
          if (balance.borrower !== balance.lender)
            return (
              // <div key={balance.id}>
              <ListGroup.Item key={balance.id} className="item">
                <li>
                  {groupUserNames[balance.borrower]} 欠 {groupUserNames[balance.lender]} ${balance.amount}
                </li>
              </ListGroup.Item>
              // </div>
            );
        })}
      </ListGroup>
    </div>
  );
};

export default Balance;
