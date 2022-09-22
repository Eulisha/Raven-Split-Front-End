import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import { ListGroup, Accordion } from 'react-bootstrap';
import { GroupInfo } from './Home';

const Balance = ({ isDebtChanged }) => {
  console.log('@balance');

  //useContext
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUsers, groupUserNames } = CurrGroupInfo;
  let { gid } = currGroup;

  //useState
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
    if (gid) {
      fetchBalance(gid);
    }
  }, [currGroup, isDebtChanged]);

  console.log(CurrGroupInfo);
  console.log(balances);
  return (
    <div id="balance">
      <ListGroup>
        {balances.length === 0 && groupUsers
          ? groupUsers.map((user) => {
              console.log(user);
              return (
                <ListGroup.Item key={user} className="item">
                  {groupUserNames[user]}
                </ListGroup.Item>
              );
            })
          : balances.map((balance) => {
              return (
                <Accordion>
                  <Accordion.Item
                    key={balance.id}
                    id={balance.id}
                    className="item"
                    eventKey="1"
                    // onClick={(event) => {
                    //   handleExtend(event, balance.id);
                    // }}
                  >
                    <Accordion.Header id={balance.id}>
                      <div className="group-balance-list">
                        <span>{groupUserNames[balance.borrower]} </span>
                        <span>own </span>
                        <span>{groupUserNames[balance.lender]} </span>
                        <span>${balance.amount}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body></Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
            })}
      </ListGroup>
    </div>
  );
};

export default Balance;
