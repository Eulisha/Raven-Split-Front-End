import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants'
import Details from './Details';
import DebtList from './DebtList';
import Edit from './Edit';


const Debts = ({members}) => {
  const [debts, setDebt] = useState([]);
  const [extend, setExtend] = useState(false)

  useEffect(() => {
    async function fetchData() {
      // const res = 
      const  {data}  = await axios(constants.API_GET_DEBTS)
      console.log('fetch data debts:',data);
      setDebt(data.data)
    }
    fetchData()
  }, [])
  console.log('set debts: ', debts);

  return (
    <div className="list">
      <Edit.ControllerButton 
        debts={debts}
        members={members}
        setDebt={setDebt}
      />
      {debts.map((item) => {
        const { id, date, title, total, isOwned, lender, ownAmount} = item;
        return (
          <div key={id}>
          <DebtList
            id={id}
            date={date}
            title={title}
            total={total}
            lender={lender}
            isOwned={isOwned}
            ownAmount={ownAmount}
            deleteData={setDebt}
            switchExtend={setExtend}
          />
          <Details 
            id={id}
            debtInfo={item}
            debts={debts}
            members = {members}
            extend={extend}
            setDebt={setDebt}
          />
          </div>
        );
      })}
    </div>
  );
};



export default Debts;
