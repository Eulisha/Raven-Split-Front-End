import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import constants from '../../../global/constants';

// const SettleButton = ({ gid, setIsSettle, debtInfo,
const SettleButton = ({ gid, setIsSettle }) => {
  const [editingShow, setEditingShow] = useState(false);

  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        結帳
      </Button>
      {editingShow && <SettleWindow gid={gid} setIsSettle={setIsSettle} show={editingShow} onHide={() => setEditingShow(false)} state="editing" />}
    </div>
  );
};

const SettleWindow = ({ gid, setIsSettle, onHide, show, state }) => {
  console.log('Editing....');
  const [settle, setSettle] = useState([]);

  useEffect(() => {
    const fetchGetSettle = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios(`${constants.API_GET_SETTLE}/${gid}`, {
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

  const fetchPostSettle = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const body = {
        settle_main: {
          gid,
          date: '2022-09-09',
          title: 'Settle all balances',
        },
        settle_detail: settle,
      };
      const { data } = await axios.post(`${constants.API_POST_SETTLE}/${gid}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: body,
      });
      if (data.data) {
        setSettle([]);
        setIsSettle(true);
        //TODO:讓setbalance, setdebt, setdetail都綁定這個事件重撈好嗎(?)
      }
    } catch (err) {
      console.log(err);
      alert(' Something went wrong...Please try again.');
    }
  };

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{state === 'editing' ? '還錢囉！' : '你正在新增文章'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h3>Edit Debts</h3>
          <h4>Settle</h4>
          <div>
            最佳結帳方式：
            {settle.map((ele, ind) => {
              return (
                <li key={ind}>
                  {ele.borrower} 還 {ele.lender} ${ele.amount}
                </li>
              );
            })}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={fetchPostSettle}>
          {' '}
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default { SettleWindow, SettleButton };
