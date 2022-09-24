import axios from 'axios';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';

const SettleOneButton = ({ settleWithId, settleWithName, setIsDebtChanged }) => {
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
          settleWithId={settleWithId}
          settleWithName={settleWithName}
          setIsDebtChanged={setIsDebtChanged}
          show={editingShow}
          onHide={() => setEditingShow(false)}
        />
      )}
    </div>
  );
};

const SettleOneWindow = ({ gid, settleWithId, settleWithName, setIsDebtChanged, onHide, show }) => {
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
        console.log(err.response);
        return alert(err.response);
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
      console.log(err.response);
      return alert(err.response);
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{`Settle Up With ${settleWithName}`}</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
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
            <Form.Control ref={inputTitle} type="text" name="title" defaultValue={`Settle Balances Between ${name} And ${settleWithName}`}></Form.Control>
          </Form.Group>
          <div>
            <ul>
              {settle.map((ele, ind) => {
                return (
                  <li key={ind}>
                    {groupUserNames[ele.borrower]} 還 {groupUserNames[ele.lender]} ${ele.amount}
                  </li>
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

export default { SettleOneWindow, SettleOneButton };
