import { useState, useEffect } from "react"
import axios from 'axios';
import constants from "../../../global/constants";

const Balance = ({gid})=>{
  const [balances, setBalance] = useState([])
  useEffect(()=>{
    const fetchBalance = async(gid)=>{
      try{
        const { data } = await axios.get(`${constants.API_GET_BALANCES}${gid}`)
        console.log('fetch data balance: ', data);
        setBalance(data.data)
        console.log('set balance:', balances);
      }catch(err){
        console.log(err);
      }
    }
    fetchBalance(gid)
  },[])

  return (
    <div>
      {balances.map((balance)=>{
        return(
        <div key={balance.id}>
          <li>{balance.borrower} 欠 {balance.lender} ${balance.amount}</li>
        </div>)
      })}
    </div>
  )

}

export default Balance