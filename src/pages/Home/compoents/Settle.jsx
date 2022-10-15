import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
import { GroupInfo } from './Home';
import Swal from 'sweetalert2';
import Icons from '../../../global/Icons';
import utils from '../../../global/utils';
import { GiPayMoney } from 'react-icons/gi';
import { BsArrowRight } from 'react-icons/bs';
import validator from '../../../global/validator';

const SettleButton = ({ setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { groupUsers } = CurrGroupInfo;
  const [editingShow, setEditingShow] = useState(false);
  return (
    <div>
      <Button size="sm" variant="outline-light" onClick={() => setEditingShow(true)}>
        Settle All
      </Button>
      {groupUsers && editingShow && <SettleWindow setIsDebtChanged={setIsDebtChanged} show={editingShow} onHide={() => setEditingShow(false)} state="editing" />}
    </div>
  );
};

const SettleWindow = ({ setIsDebtChanged, onHide, show }) => {
  //Context
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUserNames } = CurrGroupInfo;
  let gid = currGroup.gid;

  //Ref
  const inputDate = useRef();
  const formRef = useRef();

  //state
  const [settle, setSettle] = useState([]);

  const fetchOnHide = async (e) => {
    e.preventDefault;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${constants.API_POST_SETTLE_DONE}/${gid}`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.err(err);
    }
  };

  //撈settle資料
  useEffect(() => {
    window.addEventListener('beforeunload', fetchOnHide);
    setIsDebtChanged((prev) => {
      return !prev;
    });
    const fetchGetSettle = async () => {
      Swal.fire({
        title: 'Loading...',
        showConfirmButton: false,
        html: 'Calculating best graph, please wait a second.',
        allowOutsideClick: () => !Swal.isLoading(),

        didOpen: () => {
          Swal.showLoading();
          const token = localStorage.getItem('accessToken');
          return fetch(`${constants.API_GET_SETTLE}/${gid}`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
            method: 'GET',
          })
            .then(async (res) => {
              const data = await res.json();
              if (!res.ok) {
                if (res.status == 503) {
                  Swal.fire({
                    title: 'Calculating...',
                    text: data.err,
                    icon: 'info',
                    confirmButtonText: 'OK',
                  }).then(() => {
                    onHide();
                  });
                } else {
                  Swal.fire({
                    title: 'Oops!',
                    text: 'Internal Server Error',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  }).then(() => {
                    onHide();
                  });
                }
              } else {
                setTimeout(() => {
                  if (data.data.length === 0) {
                    setSettle('Currently all balance.');
                  } else {
                    let sorted = data.data.sort((a, b) => {
                      new Date(b.amount) - new Date(a.amount);
                    });
                    setSettle(sorted);
                  }
                  Swal.hideLoading();
                  Swal.close();
                }, 800);
              }
            })
            .catch(() => {
              //網路錯誤
              Swal.fire({
                title: 'Oops!',
                text: 'Network Connection failed, please try later...',
                icon: 'error',
                confirmButtonText: 'OK',
              }).then(() => {
                onHide();
              });
            });
        },
      });
    };
    fetchGetSettle();

    return () => {
      window.removeEventListener('beforeunload', fetchOnHide);
      fetchOnHide(gid);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const form = formRef.current;

    if (form.reportValidity()) {
      Swal.fire({
        title: 'Saving...',
        showConfirmButton: false,
        allowOutsideClick: () => !Swal.isLoading(),
        didOpen: async () => {
          Swal.showLoading();
          try {
            const token = localStorage.getItem('accessToken');
            const body = {
              settle_main: {
                gid,
                date: inputDate.current.value,
              },
              settle_detail: settle,
            };
            await axios.post(`${constants.API_POST_SETTLE}/${gid}`, body, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            setTimeout(() => {
              setSettle([]);
              setIsDebtChanged((prev) => {
                return !prev;
              });
              Swal.hideLoading();
              Swal.close();
              Swal.fire({ title: 'Done!', icon: 'success', showConfirmButton: false, timer: 1200 });
              onHide();
            }, 500);
          } catch (err) {
            if (!err.response.data) {
              //網路錯誤
              Swal.fire({
                title: 'Oops!',
                text: 'Network Connection failed, please try later...',
                icon: 'error',
                confirmButtonText: 'OK',
              }).then(() => {
                onHide();
              });
            } else if (err.response.data.provider) {
              //驗證失敗
              Swal.fire({
                title: 'Error!',
                text: err.response.data.err[0].msg,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              //系統錯誤
              Swal.fire({
                title: 'Oops!',
                text: 'Internal Server Error',
                icon: 'error',
                confirmButtonText: 'OK',
              }).then(() => {
                onHide();
              });
            }
          } finally {
            e.target.disabled = false;
          }
        },
      });
    } else {
      validator(formRef);
      e.target.disabled = false;
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header className="settle-header" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settle Up All Balances In Group !</Modal.Title>
      </Modal.Header>
      <Form noValidate ref={formRef}>
        <Modal.Body className="settle-body">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date</Form.Label>
            <Form.Control
              required
              ref={inputDate}
              type="date"
              min="2000-01-01"
              max="2050-12-31"
              title="date"
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${
                new Date(Date.now()).getDate() < 10 ? 0 : ''
              }${new Date(Date.now()).getDate()}`}
            />
          </Form.Group>
          <div>
            {Array.isArray(settle) ? (
              settle.map((ele) => {
                return (
                  <>
                    {ele.amount != 0 && (
                      <div className="settle-pair-items">
                        <Icons.UserIcon />
                        <span>{groupUserNames[ele.borrower]}</span>
                        <div className="settle-pair-pay-amount-wapper">
                          <BsArrowRight />
                          <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', alignItems: 'center', margin: '10px' }}>
                            <div>
                              <span className="settle-pair-pay-amount">{utils.currencyFormat(ele.amount)}</span>
                              <GiPayMoney style={{ width: '30px', height: '30px' }} />
                            </div>
                          </div>
                          <BsArrowRight />
                        </div>
                        <span>{groupUserNames[ele.lender]}</span>
                        <Icons.UserIcon />
                      </div>
                    )}
                  </>
                );
              })
            ) : (
              <span style={{ fontSize: '22px' }}>{settle}</span>
            )}
          </div>
          <Modal.Title className="settle-description">
            Above is the simpler way to let every members get thiers repayments by algorithum of Raven Split. <br /> For example: Adam owes Euli $100, and Euli owes Tim $100. Then
            we will suggsion to simply ask Adam pay back $100 to Tim.
          </Modal.Title>
        </Modal.Body>

        <Modal.Footer>
          {Array.isArray(settle) && (
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default { SettleWindow, SettleButton };
