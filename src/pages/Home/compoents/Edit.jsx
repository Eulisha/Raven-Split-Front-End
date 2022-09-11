import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import constants from '../../../global/constants'


const ControllerButton = ({debtInfo, debts, details, setDebt, setDetail, members}) => {
  const [editingShow, setEditingShow] = useState(false);

  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)} >修改</Button>
      <Button variant="outline-danger">刪除</Button>
      {editingShow &&
        <EditingWindow /** 編輯視窗 */
          debtInfo={debtInfo}
          debts={debts}
          details={details}
          members = {members}
          setDebt={setDebt}
          setDetail={setDetail}
          show={editingShow}
          onHide={() => setEditingShow(false)}
          state="editing"
        />}
    </div>
  )
}


const EditingWindow = ({ debtInfo, debts, details, members, setDebt, setDetail, onHide, show, state}) => {
  console.log('Editing....');
  const oriDebt = {}

  const [splitInfo, setInfoValue] = useState(debtInfo ? debtInfo : {gid:1, date:`${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth()+1}-${new Date(Date.now()).getDate()}`}) //FIXME: gid要再傳進來
  //整理本筆帳的初始值
  const oriSummarize = {total: splitInfo ? splitInfo.total : 0, sum: 0};
  // console.log(members, details, debts);
  members.map((member)=>{
    ////
    if (details){
      details.map((detail)=>{
        if(member.uid===detail.borrower){
          oriDebt[member.uid]={borrower: detail.borrower, name: member.name, amount: detail.amount}
          oriSummarize.sum += detail.amount
        }else{
          //本來沒有欠債關係
          oriDebt[member.uid]={borrower: member.uid, name: member.name, amount: null}
        }
      })
    }else{
      oriDebt[member.uid]={borrower: member.uid, name: member.name, amount: null}
    }
  })
  const [splitValue, setSplitValue] = useState(oriDebt)
  const [currSummarize, setSummarize] = useState(oriSummarize)

  console.log('set splitInfo: ', splitInfo);
  console.log('set splitValue: ', splitValue)
  console.log('set splitsummarize: ', currSummarize)

  //更新表單輸入
  const handleDebtInfo = (prop)=>(e)=>{
    if(e.target.name === 'total'||e.target.name === 'amount'){
      setInfoValue({...splitInfo, [prop]:Number(e.target.value)})
    }else{
    setInfoValue({...splitInfo, [prop]:e.target.value})}
    console.log('updated splitInfo:',splitInfo);
  }
  const handleSplitValue = (prop)=>(e) => {
    setSplitValue({...splitValue,[Number(prop)]: {borrower: splitValue[Number(prop)].borrower, name: splitValue[Number(prop)].name, amount: Number(e.target.value)}})
    console.log('updated splitValue:',splitValue);
  }

  //更新summarize
  useEffect(()=>{
    const currTotal = splitInfo.total
    const handleSummarize = (prop)=>{
      setSummarize({...currSummarize, [prop]:splitInfo.total})
    }
    handleSummarize('total')
  },[splitInfo])
  useEffect(()=>{
    const currSum = Object.values(splitValue).reduce((acc, curr)=>{
      return acc + curr.amount
    },0)
    const handleSummarize = (prop)=>{
      setSummarize({...currSummarize, [prop]:currSum})
    }
    handleSummarize('sum')
  },[splitValue])
  
  //儲存DB
  const saveDebts= (async()=>{
    try{
      console.log('debts: ',debts);
      const updatedDetail = []
      Object.values(splitValue).forEach((ele)=>{
        if(ele.amount){
          updatedDetail.push(ele)
        }
      })
      console.log('splitValue:',updatedDetail);
      let result;
      if(details){
        //Edit Debt
        const data = {'debt_Id':debtInfo.id,'debt_main_old':debtInfo, 'debt_detail_old':details, 'debt_main_new':splitInfo,'debt_detail_new':updatedDetail}
        result = await axios.put(constants.API_UPDATE_DEBT, data)
      }else{
        //Add Debt
        console.log('data for fetch: ',splitInfo, updatedDetail);
        const data = {'debt_main': splitInfo,'debt_detail': updatedDetail}
        result = await axios.post(constants.API_POST_DEBT, data)
      }
      console.log(result.data);

      //更新state
      if (result.status===200){
        splitInfo.id = result.data.data.debtId
        setInfoValue(splitInfo)
        console.log('new splitInfo: ',splitInfo);
        let updatedDebt; 
        if(details){
          updatedDebt= debts.map((debt)=>{
            console.log('debt: ', debt);
            return debt.id === debtInfo.id ? splitInfo : debt
        })}else{
          debts.splice(0,0,splitInfo)
          updatedDebt=debts
        }
        console.log('updateDebt:', updatedDebt);
        setDebt(updatedDebt)
        if(details){
          setDetail(updatedDetail)
        }
    }
    // setSummarize()
    }catch(err){
      console.log(err);
    }
  })

  return (
  <Modal
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    {...{ onHide, show }}
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {state === "editing" ? "你正在編輯文章" : "你正在新增文章"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div>
        <h3>Edit Debts</h3>
          <h4>費用</h4>
            <div>
              <ul>
                <li>Date: <input type="text" defaultValue={debtInfo ? debtInfo.date : splitInfo.date} onChange = {handleDebtInfo('date')}></input></li>
                <li>Title: <input type="text" defaultValue={debtInfo ? debtInfo.title : ""} onChange = {handleDebtInfo('title')}></input></li>
                <li>Total: <input type="text" name="total" defaultValue={debtInfo ? debtInfo.total : 0} onChange = {handleDebtInfo('total')}></input></li>
                <li>Paid By: <input type="text" defaultValue={debtInfo ? debtInfo.lender : ""} onChange = {handleDebtInfo('lender')}></input></li>
                <li>{`${debtInfo? (debtInfo.isOwned ? 'You Own':'You Paid') : 'You Paid'}: `}<input type="text" name="amount" defaultValue={debtInfo ? debtInfo.ownAmount : 0} onChange = {handleDebtInfo('ownAmount')}></input></li>
                <li>Split Method<input type="text" defaultValue={debtInfo ? debtInfo.split_method : ""} onChange = {handleDebtInfo('split_method')}></input></li>
              </ul>
            </div>
          <h4>費用拆分</h4>
          <div>
            <ul>
              {Object.values(splitValue).map((item)=>{
                const {borrower, name, amount} = item
                return (
                  <div key={Number(borrower)}>
                    <li>{`${name} ${'owns'} `}<input id={Number(borrower)} type="text" defaultValue={Number(amount)} onChange = {handleSplitValue(borrower)}></input></li>
                  </div>
                )
              })}
            </ul>
            <ul>總共{currSummarize.total}，還剩{currSummarize.total-currSummarize.sum}</ul>
          </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>Close</Button>
      <Button variant="outline-primary" onClick={saveDebts} > Save changes</Button>
    </Modal.Footer>
  </Modal>
)};

export default {EditingWindow, ControllerButton};