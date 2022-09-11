import axios from "axios"
import { useState, useEffect } from "react";
import constants from "../../../global/constants";
import DetailList from "./DetailList";
import Edit from './Edit';

const Details  = ({id, debtInfo, debts, members, extend, setDebt})=>{
  const [details, setDetail] = useState([]);
  
  useEffect(() => {
    if (extend[id]){
      async function fetchDetail(id) {
        // console.log('i am id:  ',id);
        const {data} = await axios(`${constants.API_GET_DEBT_DETAILS}${id}`)
        console.log('fetch data details: ', data);
        setDetail(data.data)
      }
    fetchDetail(id)
  }
  }, [extend])
  console.log('set details: ', details);

  return (
    <div>
      <Edit.ControllerButton 
        debtInfo={debtInfo} 
        debts={debts}
        details={details}
        members = {members}
        setDetail={setDetail}
        setDebt={setDebt}
      />
      {details.map((item) => {
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