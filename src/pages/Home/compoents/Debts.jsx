import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import { Accordion } from 'react-bootstrap';

const Debts = ({ currGroup, groupUsers, groupUserNames, debts, setDebt, isDebtChanged, setIsDebtChanged }) => {
  // const [extend, setExtend] = useState({}); //FIXME:應該要是一個陣列記錄所有的extend state
  console.log('@Debts');
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
    fetchDebts(currGroup.gid);
  }, [currGroup]);

  //控制細目開合
  useEffect(() => {
    setExtend(false);
  }, [isDebtChanged]);

  const handleExtend = (e) => {
    console.log(e.target);
    console.log(extend);
    setExtend(true);
    console.log(extend);
    // setExtend(() => {
    //   const debtId = Number(e.target.id);
    //   let extendStatus = {};
    //   extendStatus[debtId] = true;
    //   console.log(extendStatus);
    //   return extendStatus; //true-false交換
    //   // return { [debtId]: !prev[debtId] }; //true-false交換
    // });
  };

  return (
    <div id="debts_column">
      {debts.length > 0 &&
        debts.map((debt) => {
          return (
            <Accordion key={debt.id}>
              <Accordion.Item key={debt.id} className="debt_list" eventKey="1" onClick={handleExtend}>
                <Accordion.Header id={debt.id}>
                  <DebtList gid={currGroup.gid} groupUserNames={groupUserNames} debtInfo={debt} setDebt={setDebt} setExtend={setExtend} />
                </Accordion.Header>
                <Accordion.Body>
                  <Details
                    id="details"
                    gid={currGroup.gid}
                    groupUsers={groupUsers}
                    groupUserNames={groupUserNames}
                    debts={debts}
                    debtInfo={debt}
                    extend={extend}
                    setDebt={setDebt}
                    setIsDebtChanged={setIsDebtChanged}
                  />
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
