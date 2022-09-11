import axios from "axios"
import { useState,useEffect } from "react"
import constants from "../../../global/constants"
import Debts from "./Debts"


const  Group = () =>{
  const [members, setMembers] = useState([])
  useEffect(()=>{
    const fetchMebers = async(id)=>{
        const {data} = await axios(`${constants.API_GET_GROUP_MEMBERS}${id}`)
        console.log('fetch data group-members:  ', data);
        setMembers(data.data)
    }
    fetchMebers(1)
  },[]) 
  return (
    <div>成員列表
      <ul>
        {members.map((item)=>{
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