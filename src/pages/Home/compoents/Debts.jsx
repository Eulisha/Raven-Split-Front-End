import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import { Accordion } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { GroupInfo } from './Home';

const Debts = ({ debts, setDebt, setIsDebtChanged }) => {
  console.log('@Debts');

  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;

  const [extend, setExtend] = useState(false);

  //撈debts
  useEffect(() => {
    const fetchDebts = async (gid) => {
      try {
        const token = localStorage.getItem('accessToken');
        const result = await axios.get(`${constants.API_GET_DEBTS}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (result.status !== 200) {
          console.log(result.error);
        }
        setDebt(result.data.data);
        console.log('debts set: ', result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currGroup.gid) {
      fetchDebts(currGroup.gid);
    }
  }, [currGroup]);

  //控制細目開合
  const handleExtend = (e, id) => {
    console.log(id);
  };

  //刪除debt列
  const handleDeleteDebt = async (e) => {
    const debtId = Number(e.target.id);
    const confirm = prompt('被刪除的帳將無法復原，若真要刪除，請輸入「刪除」');
    if (confirm !== '刪除') {
      return alert(' 輸入錯誤，再考慮看看唄 ');
    }
    try {
      const token = localStorage.getItem('accessToken');
      const result = await axios.delete(`${constants.API_DELETE_DEBT}/${currGroup.gid}/${debtId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('fetch delete debt: ', result);
      if (result.status !== 200) {
        console.log(result);
        return alert(' Something wrong ˊˋ Please try again..');
      }
      //刪除成功，set debt
      setDebt((prev) => {
        return prev.filter((item) => item.id !== debtId);
      });
      setIsDebtChanged((prev) => {
        return !prev;
      });
    } catch (err) {
      console.log(err);
      return alert(' Something wrong ˊˋ Please try again..');
    }
  };
  console.log('at Debts log debts:', debts);
  return (
    <div id="debts_column">
      {debts.length > 0 &&
        debts.map((debt) => {
          return (
            <Accordion key={debt.id}>
              <Accordion.Item
                key={debt.id}
                id={debt.id}
                className="debt_list"
                eventKey="1"
                onClick={(event) => {
                  handleExtend(event, debt.id);
                }}
              >
                <Accordion.Header id={debt.id}>
                  <DebtList debtInfo={debt} setDebt={setDebt} setExtend={setExtend} />
                </Accordion.Header>
                <Accordion.Body>
                  <Details id="details" debts={debts} debtInfo={debt} extend={extend} setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
                  <Button variant="outline-secondary" id={debt.id} onClick={handleDeleteDebt}>
                    x
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
    </div>
  );
};

export default Debts;
//
