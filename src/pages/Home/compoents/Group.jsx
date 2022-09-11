import axios from "axios"
import { useState,useEffect } from "react"
import constants from "../../../global/constants"
import Balance from "./Balance"
import Debts from "./Debts"
let gid = 1 //暫時寫死

const  Group = () =>{
  const [members, setMembers] = useState([])
  useEffect(()=>{
    const fetchMembers = async(id)=>{
        const {data} = await axios(`${constants.API_GET_GROUP_MEMBERS}${id}`)
        console.log('fetch data group-members:  ', data);
        setMembers(data.data)
    }
    fetchMembers(1)
  },[]) 
  return (
    <div>成員列表
      <ul>
        {members.map((item)=>{
          return <li key={item.uid}>{item.name}</li>
        })}
      </ul>
      <Debts 
        gid = {gid}
        members = {members}
      />
      <Balance 
        gid = {gid}
      />
    </div>

  )
}

export default Group