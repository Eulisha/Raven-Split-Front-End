import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import constants from '../../../global/constants';

const SettleButton = ({ setIsSettle, debtInfo, debts, details, setDebt, setDetail, members }) => {
  const [editingShow, setEditingShow] = useState(false);

  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        結帳
      </Button>
      {editingShow && (
        <SettleWindow
          debtInfo={debtInfo}
          debts={debts}
          details={details}
          members={members}
          setDebt={setDebt}
          setDetail={setDetail}
          setIsSettle={setIsSettle}
          show={editingShow}
          onHide={() => setEditingShow(false)}
          state="editing"
        />
      )}
    </div>
  );
};

const SettleWindow = ({ setIsSettle, onHide, show, state }) => {
  console.log('Editing....');
  let gid = 76; //暫時寫死
  const [settle, setSettle] = useState([]);

  useEffect(() => {
    const fetchGetSettle = async () => {
      try {
        const { data } = await axios(`${constants.API_GET_SETTLE}${gid}?uid=1`);
        setSettle(data.data);
        console.log('set settle:  ', settle);
      } catch (err) {
        console.log(err);
        alert(' Something went wrong...Please try again.');
      }
    };
    fetchGetSettle();
  }, []);

  const fetchPostSettle = async () => {
    try {
      const body = {
        settle_main: {
          gid,
          date: '2022-09-09',
          title: 'Settle all balances',
        },
        settle_detail: settle,
      };
      const { data } = await axios.post(constants.API_POST_SETTLE, body);
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
        <Modal.Title id="contained-modal-title-vcenter">{state === 'editing' ? '你正在編輯文章' : '你正在新增文章'}</Modal.Title>
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
