import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import Settle from './Settle';
import Add from './Add';
// import Accordion from 'react-bootstrap/Accordion';

const Debts = ({ currUserId, currGroup, groupUsers, groupUserNames, isSettle, setIsSettle }) => {
  const [debts, setDebt] = useState([]);
  const [extend, setExtend] = useState({}); //FIXME:應該要是一個陣列記錄所有的extend state

  //撈debts
  useEffect(() => {
    const fetchDebts = async (currGroup) => {
      try {
        const token = localStorage.getItem('accessToken');
        const result = await axios.get(`${constants.API_GET_DEBTS}/${currGroup}`, {
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
    fetchDebts(currGroup);
  }, [currGroup]);

  //控制細目開合
  useEffect(() => {
    setExtend(false);
  }, [isSettle]);

  return (
    <div id="debts">
      <div>
        <Add.AddButton currUserId={currUserId} gid={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} setDebt={setDebt} />
        <Settle.SettleButton key="settle-button" gid={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} setIsSettle={setIsSettle} />
      </div>
      {debts.map((debt) => {
        return (
          <div key={debt.id}>
            <DebtList className="debt-list" gid={currGroup} groupUserNames={groupUserNames} debtInfo={debt} setDebt={setDebt} setExtend={setExtend} />
            <Details className="details" gid={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} debts={debts} debtInfo={debt} extend={extend} setDebt={setDebt} />
          </div>
          //   <div key={debt.id}>
          //   <DebtList className="debt-list" gid={currGroup} groupUserNames={groupUserNames} debtInfo={debt} setDebt={setDebt} setExtend={setExtend} />
          //   <Details className="details" gid={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} debts={debts} debtInfo={debt} extend={extend} setDebt={setDebt} />
          //   </div>
        );
      })}
    </div>
  );
};

export default Debts;
