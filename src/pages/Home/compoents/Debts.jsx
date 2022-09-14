import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import Settle from './Settle';
import Add from './Add';

const Debts = ({ currUserId, gid, groupUsers, groupUserNames, isSettle, setIsSettle }) => {
  const [debts, setDebt] = useState([]);
  const [extend, setExtend] = useState({}); //FIXME:應該要是一個陣列記錄所有的extend state

  //撈debts
  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const result = await axios(`${constants.API_GET_DEBTS}?group=${gid}`); //FIXME:要改成paramas
        if (result.status !== 200) {
          console.log(result.error);
        }
        setDebt(result.data.data);
        console.log('debts set: ', result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDebts();
  }, []);

  //控制細目開合
  useEffect(() => {
    setExtend(false);
  }, [isSettle]);

  return (
    <div id="debts">
      <div>
        <Add.AddButton currUserId={currUserId} gid={gid} groupUsers={groupUsers} groupUserNames={groupUserNames} setDebt={setDebt} />
        <Settle.SettleButton key="settle-button" gid={gid} groupUsers={groupUsers} groupUserNames={groupUserNames} setIsSettle={setIsSettle} />
      </div>
      {debts.map((debt) => {
        return (
          <div key={debt.id}>
            <DebtList className="debt-list" groupUserNames={groupUserNames} debtInfo={debt} setDebt={setDebt} setExtend={setExtend} />
            <Details className="details" gid={gid} groupUsers={groupUsers} groupUserNames={groupUserNames} debts={debts} debtInfo={debt} extend={extend} setDebt={setDebt} />
          </div>
        );
      })}
    </div>
  );
};

export default Debts;
