import axios from "axios"
import { useState,useEffect } from "react"
import constants from "../../../global/constants"
import Debts from "./Debts"


const  Group = () =>{
  const [members, setMembers] = useState([])
  useEffect(()=>{
    console.log('effect');
    const fetchMebers = async(id)=>{
      console.log('fetch');
        const res = await axios(`${constants.API_GET_GROUP_MEMBERS}${id}`)
        console.log(res.data);
        setMembers(res.data.data)
    }
    fetchMebers(1)
  },[]) 
  return (
    <div>成員列表
      <ul>
        {members.map((item)=>{
          console.log(item);
          return <li key={item.uid}>{item.name}</li>
        })}
      </ul>
      <Debts 
        members = {members}
      />
    </div>

  )
}

export default Group