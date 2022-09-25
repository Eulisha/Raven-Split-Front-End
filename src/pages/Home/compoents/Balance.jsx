import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import { ListGroup, Accordion } from 'react-bootstrap';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import SettleOne from './SettleOne';
import currencyFormat from '../../../global/utils';
import Swal from 'sweetalert2';

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
        console.log('BACKEND for setbalance: ', data); //{1:{uid:1,total:100,details:[{id:901,borrower:2,lender:1,amount:50}]}}
        setBalance(data.data);
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
      fetchBalance(gid);
    }
  }, [currGroup, isDebtChanged, isGroupChanged]);

  return (
    <div id="balance">
      <ListGroup>
        {balances.length === 0 && groupUsers //FIXME:會不會兩個都沒有?!
          ? groupUsers.map((user) => {
              //新群組尚無借貸關係
              return (
                <ListGroup.Item key={user} className="item">
                  {groupUserNames[user]}
                </ListGroup.Item>
              );
            })
          : balances.map((userBalance) => {
              //balance是後端整理過key group-by userID的array object
              return (
                <Accordion>
                  <Accordion.Item key={userBalance.uid} id={userBalance.uid} className="item" eventKey="1">
                    <Accordion.Header id={userBalance.uid}>
                      <div className="group-balance-list">
                        <Icons.UserIcon />
                        <span>{groupUserNames[userBalance.uid]} </span>
                        {userBalance.balance >= 0 ? (
                          <>
                            <span>paid </span>
                            <span className="owned-font">{currencyFormat(userBalance.balance)} </span>
                          </>
                        ) : (
                          <>
                            <span>owns</span>
                            <span className="own-font">{currencyFormat(-userBalance.balance)} </span>
                          </>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush" className="group-balance-detail-list">
                        {userBalance.detail.map((detail) => {
                          return (
                            <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                              {detail.lender === userBalance.uid ? (
                                //借款人 : 欠款人
                                <div className="group-balance-detail-item-wrapper">
                                  <div>{'owns'}</div>
                                  <div>{`${CurrGroupInfo.groupUserNames[detail.borrower]}`}</div>
                                  <div className="own-font">{currencyFormat(detail.amount)}</div>
                                </div>
                              ) : (
                                <div className="group-balance-detail-item-wrapper">
                                  <div>{'paid by'}</div>
                                  <div>{`${CurrGroupInfo.groupUserNames[detail.lender]}`}</div>
                                  <div className="owned-font">{currencyFormat(detail.amount)}</div>
                                </div>
                              )}
                              <SettleOne.SettleOneButton
                                key={detail.id}
                                settleFromId={detail.lender}
                                settleFromName={groupUserNames[detail.lender]}
                                settleToId={detail.borrower}
                                settleToName={groupUserNames[detail.borrower]}
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
