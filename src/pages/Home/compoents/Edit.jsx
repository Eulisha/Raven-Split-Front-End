import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import constants from '../../../global/constants'


const ControllerButton = ({debtInfo, debts, detail, setDebt, setDetail, members}) => {
  const [editingShow, setEditingShow] = useState(false);
  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)} >新增</Button>
      <Button variant="outline-danger">刪除</Button>
      {editingShow &&
        <EditingWindow /** 編輯視窗 */
          debtInfo={debtInfo}
          debts={debts}
          detail={detail}
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


const EditingWindow = ({ debtInfo, debts, detail, members, setDebt, setDetail, onHide, show, state}) => {
  console.log('in!!!');
  const value = {}
  detail.forEach((ele)=>{value[ele.id]=ele}) //本筆detail的初始值
  const [splitValue, setSplitValue] = useState(value)
  const [splitInfo, setInfoValue] = useState(debtInfo)

  const handleSplitData = (prop)=>(e) => {
    setSplitValue({...splitValue,[prop]:{id:Number(e.target.id), borrower:Number(e.target.name), amount:Number(e.target.value)}})
    console.log('updated:',splitValue);
  }
  const handleDebtInfo = (prop)=>(e)=>{
    if(e.target.name === 'total'||e.target.name === 'amount'){
      setInfoValue({...splitInfo, [prop]:Number(e.target.value)})
    }else{
    setInfoValue({...splitInfo, [prop]:e.target.value})}
    console.log('updated:',splitInfo);
  }
  

  const saveDebts= (async()=>{
    try{
      console.log('debts: ',debts);
      const updatedDetail = Object.values(splitValue)
      console.log('splitValue:',updatedDetail);
      const data = {'debt_Id':debtInfo.id,'debt_main_old':debtInfo, 'debt_detail_old':detail, 'debt_main_new':splitInfo,'debt_detail_new':updatedDetail}
      const result = await axios.put(constants.API_UPDATE_DEBT, data)
      console.log(result.data);
      if (result.status===200){
        splitInfo.id = result.data.data.debtId
        setInfoValue(splitInfo)
        console.log('new splitInfo: ',splitInfo);
        const updatedDebt = debts.map((debt)=>{
          console.log('debt: ', debt);
          return debt.id === debtInfo.id ? splitInfo : debt
        })
        console.log('updateDebt:', updatedDebt);
        await setDebt(updatedDebt)
        await setDetail(updatedDetail)
    }
    // setBalance()
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
                <li>Date: <input type="text" defaultValue={debtInfo.date} onChange = {handleDebtInfo('date')}></input></li>
                <li>Title: <input type="text" defaultValue={debtInfo.title} onChange = {handleDebtInfo('title')}></input></li>
                <li>Total: <input type="text" name="total" defaultValue={debtInfo.total} onChange = {handleDebtInfo('total')}></input></li>
                <li>Paid By: <input type="text" defaultValue={debtInfo.lender} onChange = {handleDebtInfo('lender')}></input></li>
                <li>{`${debtInfo.isOwned ? 'You Own':'You Paid'}: `}<input type="text" name="amount" defaultValue={debtInfo.ownAmount} onChange = {handleDebtInfo('ownAmount')}></input></li>
                <li>Split Method<input type="text" defaultValue={debtInfo.split_method} onChange = {handleDebtInfo('split_method')}></input></li>
              </ul>
            </div>
          <h4>費用拆分</h4>
          <div>
            <ul>
              {detail.map((item)=>{
                const {id, borrower, amount} = item
                  return (
                    <div key={id}>
                      <li>{`${borrower} ${'owns'} `}<input id={id} name={borrower} type="text" defaultValue={amount} onChange = {handleSplitData(id)}></input></li>
                    </div>
                  )
              })}
            </ul>
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