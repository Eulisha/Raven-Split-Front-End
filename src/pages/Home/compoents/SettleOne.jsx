import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
// import { User } from '../../App';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import currencyFormat from '../../../global/utils';
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
  // console.log('settleToId, settleToName, gid: ', settleToId, settleToName, gid);

  return (
    <div className="group-balance-list-settle-button-wrapper">
      <Button size="sm" variant="outline-info" className="group-balance-list-settle-button" onClick={() => setEditingShow(true)}>
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
  // const [settle, setSettle] = useState([]);
  // console.log('user id, name, email, settleToId, settleToName, groupUserNames: ', id, name, email, settleToId, settleToName, groupUserNames);

  //跳出時送後端解鎖
  useEffect(() => {
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
    e.target.disabled = true;
    console.log('@handle submit settle pair');
    const form = formRef.current;

    if (form.reportValidity()) {
      try {
        const token = localStorage.getItem('accessToken');
        const body = {
          settle_main: {
            gid,
            date: inputDate.current.value,
            // title: `Settle Balances Between ${settleFromName} And ${settleToName}`,
          },
          // settle_detail: settle,
        };
        console.log('FRONT for settle pair: ', body);
        const { data } = await axios.post(`${constants.API_POST_SETTLE_PAIR}/${gid}/${settleFromId}/${settleToId}`, body, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log('BACKEND settle pair result: ', data);
        console.log(setIsDebtChanged);
        // setSettle([]);
        setIsDebtChanged((prev) => {
          return !prev;
        });
        console.log('finished');
        onHide();
      } catch (err) {
        console.log(err);
        if (err.response.data.provider) {
          //從validator來的error是array形式
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
          e.target.disabled = false;
        } else {
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
          onHide();
        }
        return;
      }
    } else {
      validator(formRef);
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
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${new Date(
                Date.now()
              ).getDate()}`}
            />
            {/* <Form.Label>Title</Form.Label> */}
            {/* <Form.Control ref={inputTitle} type="text" name="title" defaultValue={`Settle Balances Between ${settleFromName} And ${settleToName}`} disabled></Form.Control> */}
          </Form.Group>

          <div className="settle-pair-items">
            <Icons.UserIcon />
            <span>{settleFromName}</span>
            <div className="settle-pair-pay-amount-wapper">
              <BsArrowRight />
              <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', alignItems: 'center', margin: '10px' }}>
                <div>
                  <span className="settle-pair-pay-amount">{currencyFormat(settleAmount)}</span>
                  <GiPayMoney style={{ width: '30px', height: '30px' }} />
                </div>
              </div>
              <BsArrowRight />
            </div>
            <span>{settleToName}</span>
            <Icons.UserIcon />
          </div>
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
