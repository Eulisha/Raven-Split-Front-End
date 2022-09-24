import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import { ListGroup, Accordion } from 'react-bootstrap';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
// import SettleOne from './SettleOne';

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
          : balances.map((userBalance) => {
              return (
                <Accordion>
                  <Accordion.Item key={userBalance.uid} id={userBalance.uid} className="item" eventKey="1">
                    <Accordion.Header id={userBalance.uid}>
                      <div className="group-balance-list">
                        <Icons.UserIcon />
                        <span>{groupUserNames[userBalance.uid]} </span>
                        {userBalance.balance > 0 ? (
                          <>
                            <span>paid </span>
                            <span className="owned-font">{`NT$ ${userBalance.balance}`} </span>
                          </>
                        ) : (
                          <>
                            <span>owns</span>
                            <span className="own-font">{`NT$ ${-userBalance.balance}`} </span>
                          </>
                        )}
                      </div>
                      {/* <SettleOne.SettleOneButton settleWithId={userBalance.uid} settleWithName={groupUserNames[userBalance.uid]} /> */}
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush" className="group-balance-detail-list">
                        {userBalance.detail.map((detail) => {
                          return detail.borrower === userBalance.uid ? (
                            <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                              <div>owns</div>
                              <div>{`${CurrGroupInfo.groupUserNames[detail.lender]}`}</div>
                              <div className="own-font">{`NT$ ${detail.amount}`}</div>
                            </ListGroup.Item>
                          ) : (
                            <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                              <div>owned by</div>
                              <div>{`${CurrGroupInfo.groupUserNames[detail.borrower]}`}</div>
                              <div className="owned-font">{`NT$ ${detail.amount}`}</div>
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
            })}
      </ListGroup>
    </div>
  );
};

export default Balance;
