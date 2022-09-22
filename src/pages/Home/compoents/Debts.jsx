import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import { Accordion } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import { GroupInfo } from './Home';

const Debts = ({ setIsDebtChanged }) => {
  console.log('@Debts');
  const [debts, setDebt] = useState([]);

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

  console.log('at Debts log debts:', debts);
  return (
    <div id="debts_column">
      <div className="debt-top-bar">
        Expense List
        {/* <RiUserSettingsLine style={{ marginLeft: '10px' }} /> */}
      </div>
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
