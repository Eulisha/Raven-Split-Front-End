import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../global/constants'
import Details from './Details';
import DebtList from './DebtList';
import Edit from './Edit';


const Debts = ({members}) => {
  const [debts, setDebt] = useState([]);
  const [extend, setExtend] = useState({})
  const [editingShow, setEditingShow] = useState(false);

  //要資料

useEffect(() => {
  async function fetchData() {
    // const res = 
    const  res  = await axios(constants.API_GET_DEBTS)
    console.log('useEffect data:',res.data);
    setDebt(res.data.data)
  }
  fetchData()
}, [])
  return (
    <div className="list">
      <Edit.ControllerButton 
        debts={debts}
        members = {members}
        setDebt={setDebt}
      />
      {debts.map((item) => {
        // setExtendDefault(item.id)
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
            extend={extend}
          />
          </div>
        );
      })}
    </div>
  );
};



export default Debts;
