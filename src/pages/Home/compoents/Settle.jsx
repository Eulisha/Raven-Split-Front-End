import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import constants from '../../../global/constants';

// const SettleButton = ({ gid, setIsDebtChanged, debtInfo,
const SettleButton = ({ gid, setIsDebtChanged }) => {
  const [editingShow, setEditingShow] = useState(false);
  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        Settle
      </Button>
      {editingShow && <SettleWindow gid={gid} setIsDebtChanged={setIsDebtChanged} show={editingShow} onHide={() => setEditingShow(false)} state="editing" />}
    </div>
  );
};

const SettleWindow = ({ gid, setIsDebtChanged, onHide, show, state }) => {
  console.log('Editing....');
  const [settle, setSettle] = useState([]);
  const inputDate = useRef();
  const inputTitle = useRef();

  useEffect(() => {
    const fetchGetSettle = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${constants.API_GET_SETTLE}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setSettle(data.data);
        console.log('set settle:  ', settle);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGetSettle();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log('body: ', body);
      const { data } = await axios.post(`${constants.API_POST_SETTLE}/${gid}`, body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (data.data) {
        setSettle([]);
        setIsDebtChanged((prev) => {
          return !prev;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{state === 'editing' ? '還錢囉！' : '你正在新增文章'}</Modal.Title>
      </Modal.Header>
      <Form onClick={handleSubmit}>
        <Modal.Body>
          最佳結帳方式：
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date</Form.Label>
            <Form.Control
              ref={inputDate}
              type="text"
              name="data"
              defaultValue={`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1}-${new Date(Date.now()).getDate()}`}
            />
            <Form.Label>Title</Form.Label>
            <Form.Control ref={inputTitle} type="text" name="title" defaultValue="Settle Group All Debts"></Form.Control>
          </Form.Group>
          <div>
            <ul>
              {settle.map((ele, ind) => {
                return (
                  <li key={ind}>
                    {ele.borrower} 還 {ele.lender} ${ele.amount}
                  </li>
                );
              })}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="outline-secondary">Close</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default { SettleWindow, SettleButton };
