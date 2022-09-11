import { useState, useEffect } from "react";
import constants from "../../../global/constants";
import DetailList from "./DetailList";
import Edit from './Edit';

async function fetchDetail(setDetail, id) {
  // console.log('i am id:  ',id);
  const res = await fetch(`${constants.API_GET_DEBT_DETAILS}${id}`)
  const { data } = await res.json()
  console.log('detail: ', data);
  setDetail(data)
  localStorage.setItem(`detail_${id}`, JSON.stringify(data))
}

const Details  = ({id, debtInfo, debts, index, extend, setDebt})=>{
  const [detail, setDetail] = useState([]);
  
  useEffect(() => {
    if (extend[id]){
    fetchDetail(setDetail, id)
  }
  }, [extend])

  return (
    <div>
      <Edit.ControllerButton 
        debtInfo={debtInfo} 
        debts={debts}
        index={index}
        detail={detail}
        setDetail={setDetail}/>
      {detail.map((item) => {
        const { id, borrower, amount} = item
        return (
            <DetailList
            key={id}
            id={id} 
            borrower={borrower}
            amount={amount}
            debtInfo={debtInfo}
            />
          )
        })}
      </div>)
}

export default Details