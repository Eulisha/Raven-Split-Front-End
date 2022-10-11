import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
// import { User } from '../../App';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import utils from '../../../global/utils';
// import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { GiPayMoney } from 'react-icons/gi';
import { BsArrowRight } from 'react-icons/bs';
import Swal from 'sweetalert2';
import validator from '../../../global/validator';

const SettleOneButton = ({ ownStatus, settleFromId, settleFromName, settleToId, settleToName, settleAmount, setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;
  let gid = currGroup.gid;
  const [editingShow, setEditingShow] = useState(false);
  // const [getLock, setGetLock] = useState(false);
  // console.log('settleToId, settleToName, gid: ', settleToId, settleToName, gid);

  const checkIfSettlable = async () => {
    setIsDebtChanged((prev) => {
      return !prev;
    });

    try {
      const token = localStorage.getItem('accessToken');
      await axios(`${constants.API_GET_SETTLE_PAIR}/${gid}/${settleFromId}/${settleToId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // setGetLock(true);
      setEditingShow(true);
    } catch (err) {
      if (!err.response.data) {
        //網路錯誤
        Swal.fire({
          title: 'Error!',
          text: 'Network Connection failed, please try later...',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else if (err.response.status == 503) {
        Swal.fire({
          title: 'Oops!',
          text: err.response.data.err,
          icon: 'info',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Internal Server Error',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <div className="group-balance-list-settle-button-wrapper">
      <Button size="sm" variant="outline-info" className="group-balance-list-settle-button" onClick={() => checkIfSettlable()}>
        Settle
      </Button>
      {editingShow && (
        <SettleOneWindow
          gid={gid}
          ownStatus={ownStatus}
          settleFromId={settleFromId}
          settleToId={settleToId}
          settleFromName={settleFromName}
          settleToName={settleToName}
          settleAmount={settleAmount}
          setIsDebtChanged={setIsDebtChanged}
          show={editingShow}
          onHide={() => setEditingShow(false)}
        />
      )}
    </div>
  );
};

const SettleOneWindow = ({ gid, settleFromId, settleFromName, settleToId, settleToName, settleAmount, setIsDebtChanged, onHide, show }) => {
  console.log('@Settle pair');

  //Context
  // let CurrUser = useContext(User);
  // let CurrGroupInfo = useContext(GroupInfo);
  // let { id, name, email } = CurrUser.user;
  // let { groupUserNames } = CurrGroupInfo;

  //Ref
  const inputDate = useRef();
  // const inputTitle = useRef();
  const formRef = useRef();

  //state
  // console.log('user id, name, email, settleToId, settleToName, groupUserNames: ', id, name, email, settleToId, settleToName, groupUserNames);

  useEffect(() => {
    //跳出時送後端解鎖
    return () => {
      const fetchOnHide = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const { data } = await axios.post(
            `${constants.API_POST_SETTLE_DONE}/${gid}`,
            {},
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('BACKEND settleDone result:  ', data.data);
        } catch (err) {
          console.log(err.response.data.err);
          if (!err.response.data) {
            //網路錯誤
            Swal.fire({
              title: 'Error!',
              text: 'Network Connection failed, please try later...',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {
              onHide();
            });
          } else {
            return Swal.fire({
              title: 'Error!',
              text: 'Internal Server Error',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {
              onHide();
            });
          }
        }
      };
      fetchOnHide();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    console.log('@handle submit settle pair');
    const form = formRef.current;

    if (form.reportValidity()) {
      try {
        const body = {
          settle_main: {
            gid,
            date: inputDate.current.value,
          },
        };
        console.log('FRONT for settle pair: ', body);

        //傳給後端
        Swal.fire({
          title: 'Saving...',
          showConfirmButton: false,
          didOpen: async () => {
            Swal.showLoading();
            const token = localStorage.getItem('accessToken');
            return await fetch(`${constants.API_POST_SETTLE_PAIR}/${gid}/${settleFromId}/${settleToId}`, {
              headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json',
              },
              body: JSON.stringify(body),
              method: 'POST',
            })
              .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                  if (res.status == 400) {
                    //後端驗失敗
                    //從validator來的error是array形式
                    return Swal.fire({
                      title: 'Error!',
                      text: data.err[0].msg,
                      icon: 'error',
                      confirmButtonText: 'OK',
                    });
                  } else if (res.status == 503) {
                    Swal.fire({
                      title: 'Oops!',
                      text: data.err,
                      icon: 'info',
                      confirmButtonText: 'OK',
                    }).then(() => {
                      onHide();
                    });
                  } else {
                    //系統錯誤
                    Swal.fire({
                      title: 'Error!',
                      text: 'Internal Server Error',
                      icon: 'error',
                      confirmButtonText: 'OK',
                    }).then(() => {
                      onHide();
                    });
                  }
                } else {
                  console.log('BACKEND settle pair result: ', data.data);
                  console.log(setIsDebtChanged);
                  setIsDebtChanged((prev) => {
                    return !prev;
                  });
                  Swal.hideLoading();
                  onHide();
                  Swal.fire('Updated!', 'Expense has been updated.', 'success');
                }
              })
              .catch(() => {
                //網路錯誤
                Swal.fire({
                  title: 'Error!',
                  text: 'Network Connection failed, please try later...',
                  icon: 'error',
                  confirmButtonText: 'OK',
                }).then(() => {
                  onHide();
                });
              });
          },
        });
      } catch (err) {
        console.log(err);
      } finally {
        e.target.disabled = false;
      }
    } else {
      validator(formRef);
      e.target.disabled = false;
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header className="settle-header" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{`Settle Up With ${settleToName}`}</Modal.Title>
      </Modal.Header>
      <Form noValidate ref={formRef}>
        <Modal.Body className="settle-body">
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              ref={inputDate}
              required
              type="date"
              min="2000-01-01"
              max="2050-12-31"
              title="date"
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${
                new Date(Date.now()).getDate() < 10 ? 0 : ''
              }${new Date(Date.now()).getDate()}`}
            />
            {/* <Form.Label>Title</Form.Label> */}
            {/* <Form.Control ref={inputTitle} type="text" name="title" defaultValue={`Settle Balances Between ${settleFromName} And ${settleToName}`} disabled></Form.Control> */}
          </Form.Group>

          {settleAmount !== 0 ? (
            <div className="settle-pair-items">
              <Icons.UserIcon />
              <span>{settleFromName}</span>
              <div className="settle-pair-pay-amount-wapper">
                <BsArrowRight />
                <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', alignItems: 'center', margin: '10px' }}>
                  <div>
                    <span className="settle-pair-pay-amount">{utils.currencyFormat(settleAmount)}</span>
                    <GiPayMoney style={{ width: '30px', height: '30px' }} />
                  </div>
                </div>
                <BsArrowRight />
              </div>
              <span>{settleToName}</span>
              <Icons.UserIcon />
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '22px' }}>Currently All Balance</span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default { SettleOneWindow, SettleOneButton };
