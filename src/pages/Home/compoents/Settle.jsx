import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
import { GroupInfo } from './Home';
<<<<<<< HEAD
import Swal from 'sweetalert2';
=======
import Icons from '../../../global/Icons';
import currencyFormat from '../../../global/utils';
import { GiPayMoney } from 'react-icons/gi';
import { BsArrowRight } from 'react-icons/bs';
>>>>>>> layout

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
  const inputTitle = useRef();

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

        setSettle(data.data);
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
  }, []);

  const handleSubmit = async () => {
    console.log('@handle settle submit group');

    try {
      const token = localStorage.getItem('accessToken');
      const body = {
        settle_main: {
          gid,
          date: inputDate.current.value,
          title: inputTitle.current.value,
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
      console.log(err.response.data.err);
      return Swal.fire({
        title: 'Error!',
        text: err.response.data.err,
        icon: 'error',
        confirmButtonText: 'Cool',
      });
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">還錢囉！</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          最佳結帳方式：
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date</Form.Label>
            <Form.Control
              ref={inputDate}
              type="text"
              name="data"
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${new Date(
                Date.now()
              ).getDate()}`}
            />
            <Form.Label>Title</Form.Label>
            <Form.Control ref={inputTitle} type="text" name="title" defaultValue="Settle Group All Balances"></Form.Control>
          </Form.Group>
          <div>
            <ul>
              {settle.map((ele) => {
                return (
                  // <>
                  //   <li key={ind}>
                  //     {groupUserNames[ele.borrower]} 還 {groupUserNames[ele.lender]} ${ele.amount}
                  //   </li>

                  <div className="settle-pair-items">
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
                  </div>
                  // </>
                );
              })}
            </ul>
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
