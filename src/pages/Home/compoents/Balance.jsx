import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import { ListGroup, Accordion } from 'react-bootstrap';
import { User } from '../../App';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import SettleOne from './SettleOne';
import utils from '../../../global/utils';
import Swal from 'sweetalert2';
import { FaBalanceScale } from 'react-icons/fa';

const Balance = ({ isDebtChanged, setIsDebtChanged }) => {
  //useContext
  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let currUserId = CurrUser.user.id;
  let currUserName = CurrUser.user.name;
  let { currGroup, groupUserNames, isGroupChanged } = CurrGroupInfo;
  let { gid } = currGroup;

  //useState
  const [currUserBalance, setcurrUserBalance] = useState({});
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

        let currUserObject = {};
        let otherUserArr = [];

        data.data.map((ele) => {
          if (ele.uid === currUserId) {
            currUserObject = ele;
          } else {
            otherUserArr.push(ele);
          }
        });
        setcurrUserBalance(currUserObject);
        setBalance(otherUserArr);
      } catch (err) {
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Oops!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    if (gid) {
      fetchBalance(gid);
    }
  }, [currGroup, isDebtChanged, isGroupChanged]);

  return (
    <div id="balance">
      {currUserBalance.uid && balances.length > 0 && (
        <div>
          <div className="group-users-top-bar"> Your Balance In Group</div>
          <Accordion key={gid} defaultActiveKey={gid} alwaysOpen>
            <Accordion.Item key={currUserId} className="item" eventKey={gid}>
              <Accordion.Header>
                <div className="group-balance-list">
                  <Icons.UserIcon />
                  <span>{currUserName} </span>
                  {currUserBalance.balance >= 0 ? (
                    <>
                      <span>get back </span>
                      <span className="owed-font">{utils.currencyFormat(currUserBalance.balance)} </span>
                    </>
                  ) : (
                    <>
                      <span>owes</span>
                      <span className="owe-font">{utils.currencyFormat(-currUserBalance.balance)} </span>
                    </>
                  )}
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush" className="group-balance-detail-list">
                  {currUserBalance.detail.length !== 0 ? (
                    currUserBalance.detail.map((detail) => {
                      return (
                        <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                          {detail.lender === currUserBalance.uid ? (
                            //header是lender所以裡面是borrower
                            <div className="group-balance-detail-item-wrapper">
                              <div>owed by</div>
                              <div>{`${CurrGroupInfo.groupUserNames[detail.borrower]}`}</div>
                              <div className="owe-font">{utils.currencyFormat(detail.amount)}</div>
                            </div>
                          ) : (
                            //header是borrower所以裡面是lender
                            <div className="group-balance-detail-item-wrapper">
                              <div>paid by</div>
                              <div>{`${CurrGroupInfo.groupUserNames[detail.lender]}`}</div>
                              <div className="owed-font">{utils.currencyFormat(detail.amount)}</div>
                            </div>
                          )}
                          <SettleOne.SettleOneButton
                            key={detail.id}
                            settleFromId={detail.borrower}
                            settleFromName={groupUserNames[detail.borrower]}
                            settleToId={detail.lender}
                            settleToName={groupUserNames[detail.lender]}
                            settleAmount={detail.amount}
                            setIsDebtChanged={setIsDebtChanged}
                          />
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <div className="group-balance-detail-none">
                      <FaBalanceScale />
                      <span>Currently All Balanced.</span>
                    </div>
                  )}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="group-users-top-bar"> Others' Balance In Group</div>
          <Accordion>
            {balances.map((userBalance) => {
              //balance是後端整理過key group-by userID的array object
              return (
                <Accordion.Item key={`${gid}-${userBalance.uid}`} className="item" eventKey={`${gid}-${userBalance.uid}`}>
                  <Accordion.Header>
                    <div className="group-balance-list">
                      <Icons.UserIcon />
                      <span>{groupUserNames[userBalance.uid]} </span>
                      {userBalance.balance >= 0 ? (
                        <>
                          <span>get back </span>
                          <span className="owed-font">{utils.currencyFormat(userBalance.balance)} </span>
                        </>
                      ) : (
                        <>
                          <span>owes</span>
                          <span className="owe-font">{utils.currencyFormat(-userBalance.balance)} </span>
                        </>
                      )}
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush" className="group-balance-detail-list">
                      {userBalance.detail.length !== 0 ? (
                        userBalance.detail.map((detail) => {
                          return (
                            <ListGroup.Item key={detail.id} className="group-balance-detail-item">
                              {detail.lender === userBalance.uid ? (
                                //header是lender所以裡面是borrower
                                <div className="group-balance-detail-item-wrapper">
                                  <div>owed by</div>
                                  <div>{`${CurrGroupInfo.groupUserNames[detail.borrower]}`}</div>
                                  <div className="owe-font">{utils.currencyFormat(detail.amount)}</div>
                                </div>
                              ) : (
                                //header是borrower所以裡面是lender
                                <div className="group-balance-detail-item-wrapper">
                                  <div>paid by</div>
                                  <div>{`${CurrGroupInfo.groupUserNames[detail.lender]}`}</div>
                                  <div className="owed-font">{utils.currencyFormat(detail.amount)}</div>
                                </div>
                              )}
                              <SettleOne.SettleOneButton
                                key={detail.id}
                                settleFromId={detail.borrower}
                                settleFromName={groupUserNames[detail.borrower]}
                                settleToId={detail.lender}
                                settleToName={groupUserNames[detail.lender]}
                                settleAmount={detail.amount}
                                setIsDebtChanged={setIsDebtChanged}
                              />
                            </ListGroup.Item>
                          );
                        })
                      ) : (
                        <div className="group-balance-detail-none">
                          <FaBalanceScale />
                          <span>Currently All Balanced.</span>
                        </div>
                      )}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Balance;
