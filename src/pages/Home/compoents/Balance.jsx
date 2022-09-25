import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import { ListGroup, Accordion } from 'react-bootstrap';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import SettleOne from './SettleOne';

const Balance = ({ isDebtChanged }) => {
  console.log('@balance');

  //useContext
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUsers, groupUserNames, isGroupChanged } = CurrGroupInfo;
  let { gid } = currGroup;
  console.log('currGroup, groupUsers, groupUserNames, isGroupChanged, gid: ', currGroup, groupUsers, groupUserNames, isGroupChanged, gid);

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
        console.log('BACKEND for setbalance: ', data);
        setBalance(data.data);
      } catch (err) {
        console.log(err.response.data.err);
        return alert(err.response.data.err);
      }
    };
    if (gid) {
      fetchBalance(gid);
    }
  }, [currGroup, isDebtChanged, isGroupChanged]);

  return (
    <div id="balance">
      <ListGroup>
        {balances.length === 0 && groupUsers //FIXME:會不會兩個都沒有?!
          ? groupUsers.map((user) => {
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
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush" className="group-balance-detail-list">
                        {userBalance.detail.map((detail) => {
                          return detail.borrower === userBalance.uid ? (
                            <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                              <div className="group-balance-detail-item-wrapper">
                                <div>owns</div>
                                <div>{`${CurrGroupInfo.groupUserNames[detail.lender]}`}</div>
                                <div className="own-font">{`NT$ ${detail.amount}`}</div>
                              </div>
                              <SettleOne.SettleOneButton
                                key={detail.id}
                                ownStatus={'own'}
                                settleWithId={userBalance.uid}
                                settleWithName={groupUserNames[userBalance.uid]}
                                settleAmount={detail.amount}
                              />
                            </ListGroup.Item>
                          ) : (
                            <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                              <div className="group-balance-detail-item-wrapper">
                                <div>owned by</div>
                                <div>{`${CurrGroupInfo.groupUserNames[detail.borrower]}`}</div>
                                <div className="owned-font">{`NT$ ${detail.amount}`}</div>
                              </div>
                              <SettleOne.SettleOneButton
                                key={detail.id}
                                ownStatus={'owned'}
                                settleWithId={userBalance.uid}
                                settleWithName={groupUserNames[userBalance.uid]}
                                settleAmount={detail.amount}
                              />
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
