import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import currencyFormat from '../../../global/utils';
// import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { GiPayMoney } from 'react-icons/gi';
import { BsArrowRight } from 'react-icons/bs';

const SettleOneButton = ({ ownStatus, settleWithId, settleWithName, settleAmount, setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;
  let gid = currGroup.gid;
  const [editingShow, setEditingShow] = useState(false);
  console.log('settleWithId, settleWithName, gid: ', settleWithId, settleWithName, gid);

  return (
    <div>
      <Button size="sm" variant="outline-info" className="group-balance-list-settle-button" onClick={() => setEditingShow(true)}>
        Settle
      </Button>
      {editingShow && (
        <SettleOneWindow
          gid={gid}
          ownStatus={ownStatus}
          settleWithId={settleWithId}
          settleWithName={settleWithName}
          settleAmount={settleAmount}
          setIsDebtChanged={setIsDebtChanged}
          show={editingShow}
          onHide={() => setEditingShow(false)}
        />
      )}
    </div>
  );
};

const SettleOneWindow = ({ gid, ownStatus, settleWithId, settleWithName, settleAmount, setIsDebtChanged, onHide, show }) => {
  console.log('@Settle pair');

  //Context
  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let { id, name, email } = CurrUser.user;
  let { groupUserNames } = CurrGroupInfo;

  //Ref
  const inputDate = useRef();
  const inputTitle = useRef();

  //state
  const [settle, setSettle] = useState([]);
  console.log('user id, name, email, settleWithId, settleWithName, groupUserNames: ', id, name, email, settleWithId, settleWithName, groupUserNames);

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
        console.log('BACKEND for setSettle:  ', data.data);
        setSettle(data.data);
      } catch (err) {
        console.log(err.response.data.err);
        return alert(err.response.data.err);
      }
    };
    fetchGetSettle();
  }, []);

  const handleSubmit = async () => {
    console.log('@handle submit settle pair');
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
      console.log('FRONT for settle pair: ', body);
      const { data } = await axios.post(`${constants.API_POST_SETTLE_PAIR}/${gid}/${id}/${settleWithId}`, body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('BACKEND settle pair result: ', data);

      setSettle([]);
      setIsDebtChanged((prev) => {
        return !prev;
      });

      onHide();
    } catch (err) {
      console.log(err.response.data.err);
      return alert(err.response.data.err);
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{`Settle Up With ${settleWithName}`}</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body className="settle-pair-form-body">
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              ref={inputDate}
              type="date"
              name="data"
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${new Date(
                Date.now()
              ).getDate()}`}
            />
            <Form.Label>Title</Form.Label>
            <Form.Control ref={inputTitle} type="text" name="title" defaultValue={`Settle Balances Between ${name} And ${settleWithName}`}></Form.Control>
          </Form.Group>

          {ownStatus === 'own' ? (
            <div className="settle-pair-items">
              <Icons.UserIcon />
              <span>{name}</span>
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
              <span>{settleWithName}</span>
              <Icons.UserIcon />
            </div>
          ) : (
            <div className="settle-pair-items">
              <Icons.UserIcon />
              <span>{settleWithName}</span>
              <div className="settle-pair-pay-amount-wapper">
                <BsArrowRight />
                <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', alignItems: 'center', margin: '10px' }}>
                  <div>
                    <GiPayMoney style={{ width: '30px', height: '30px' }} />
                    <span className="settle-pair-pay-amount">{currencyFormat(settleAmount)}</span>
                  </div>
                </div>
                <BsArrowRight />
              </div>
              <span>{name}</span>
              <Icons.UserIcon />
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
