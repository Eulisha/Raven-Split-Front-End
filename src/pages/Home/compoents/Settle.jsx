import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
import { GroupInfo } from './Home';
import Swal from 'sweetalert2';
import Icons from '../../../global/Icons';
import currencyFormat from '../../../global/utils';
import { GiPayMoney } from 'react-icons/gi';
import { BsArrowRight } from 'react-icons/bs';
import validator from '../../../global/validator';

const SettleButton = ({ setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { groupUsers } = CurrGroupInfo;
  const [editingShow, setEditingShow] = useState(false);
  return (
    <div>
      <Button size="sm" variant="outline-info" onClick={() => setEditingShow(true)}>
        Settle All
      </Button>
      {groupUsers && editingShow && <SettleWindow setIsDebtChanged={setIsDebtChanged} show={editingShow} onHide={() => setEditingShow(false)} state="editing" />}
    </div>
  );
};

const SettleWindow = ({ setIsDebtChanged, onHide, show }) => {
  console.log('@Settle');

  //Context
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUserNames } = CurrGroupInfo;
  let gid = currGroup.gid;
  console.log('currGroup, groupUserNames, gid: ', currGroup, groupUserNames, gid);

  //Ref
  const inputDate = useRef();
  // const inputTitle = useRef();
  const formRef = useRef();

  //state
  const [settle, setSettle] = useState([]);

  //撈settle資料
  useEffect(() => {
    const fetchGetSettle = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${constants.API_GET_SETTLE}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setSettle: ', data.data);
        let sorted = data.data.sort((a, b) => {
          return new Date(b.amount) - new Date(a.amount);
        });
        setSettle(sorted);
      } catch (err) {
        console.log(err);
        console.log(err.response.data.err);
        return Swal.fire({
          title: 'Error!',
          text: err.response.data.err,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      }
    };
    fetchGetSettle();

    return () => {
      console.log('關掉彈窗了!!');

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
          return Swal.fire({
            title: 'Error!',
            text: err.response.data.err,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      };
      fetchOnHide();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('@handle settle submit group');
    const form = formRef.current;
    if (form.reportValidity()) {
      console.log(form, validator);
      try {
        const token = localStorage.getItem('accessToken');
        const body = {
          settle_main: {
            gid,
            date: inputDate.current.value,
            // title: inputTitle.current.value,
          },
          settle_detail: settle,
        };
        console.log('FRONT for settle group: ', body);
        const { data } = await axios.post(`${constants.API_POST_SETTLE}/${gid}`, body, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND settle result: ', data);

        setSettle([]);
        setIsDebtChanged((prev) => {
          return !prev;
        });

        onHide();
      } catch (err) {
        console.log(err.response);
        if (err.response.data.provider) {
          //從validator來的error是array形式
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
        onHide();
        return;
      }
    } else {
      validator(formRef);
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header className="settle-header" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settle Up All Balances In Group !</Modal.Title>
      </Modal.Header>
      <Form noValidate ref={formRef}>
        <Modal.Body className="settle-body">
          <Modal.Title className="settle-description"> Below is the simple way to let every members get thiers repayments</Modal.Title>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date</Form.Label>
            <Form.Control
              required
              ref={inputDate}
              type="date"
              min="2000-01-01"
              max="2050-12-31"
              title="date"
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${new Date(
                Date.now()
              ).getDate()}`}
            />
            {/* <Form.Label>Title</Form.Label> */}
            {/* <Form.Control ref={inputTitle} type="text" name="title" defaultValue="Settle Group All Balances" disabled></Form.Control> */}
          </Form.Group>
          <div>
            {settle.map((ele) => {
              return (
                <div className="settle-pair-items">
                  {ele.amount == 0 ? (
                    <>
                      <Icons.UserIcon />
                      <span>{groupUserNames[ele.borrower]}</span>
                      <div className="settle-pair-pay-amount-wapper">
                        <BsArrowRight />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', alignItems: 'center', margin: '10px' }}>
                          <div>
                            <span className="settle-pair-pay-amount" style={{ color: '#dddcdc' }}>
                              {currencyFormat(ele.amount)}
                            </span>
                            <GiPayMoney style={{ width: '30px', height: '30px', color: '#dddcdc' }} />
                          </div>
                        </div>
                        <BsArrowRight />
                      </div>
                      <span>{groupUserNames[ele.lender]}</span>
                      <Icons.UserIcon />
                    </>
                  ) : (
                    <>
                      <Icons.UserIcon />
                      <span>{groupUserNames[ele.borrower]}</span>
                      <div className="settle-pair-pay-amount-wapper">
                        <BsArrowRight />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', alignItems: 'center', margin: '10px' }}>
                          <div>
                            <span className="settle-pair-pay-amount">{currencyFormat(ele.amount)}</span>

                            <GiPayMoney style={{ width: '30px', height: '30px' }} />
                          </div>
                        </div>
                        <BsArrowRight />
                      </div>
                      <span>{groupUserNames[ele.lender]}</span>
                      <Icons.UserIcon />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default { SettleWindow, SettleButton };
