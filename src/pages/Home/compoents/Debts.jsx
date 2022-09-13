import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import Settle from './Settle';
import Add from './Add';

const Debts = ({ members, gid, isSettle, setIsSettle }) => {
  const [debts, setDebt] = useState([]);
  const [extend, setExtend] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // const res =
      const { data } = await axios(`${constants.API_GET_DEBTS}?group=${gid}`);
      console.log('fetch data debts:', data);
      setDebt(data.data);
      console.log('set debts: ', data.data);
    };
    fetchData();
  }, [isSettle]);

  return (
    <div id="debts">
      <div id="top-button">
        <Add.AddButton gid={gid} debts={debts} members={members} setDebt={setDebt} />
        <Settle.SettleButton key="settle-button" gid={gid} setIsSettle={setIsSettle} />
      </div>
      {debts.map((item) => {
        return (
          <div key={item.id}>
            <DebtList className="debt-list" debtInfo={item} setDebt={setDebt} setExtend={setExtend} isSettle={isSettle} />
            <Details className="details" gid={gid} debtInfo={item} debts={debts} members={members} extend={extend} setDebt={setDebt} />
          </div>
        );
      })}
    </div>
  );
};

export default Debts;
