const DebtList = ({ debtInfo, setExtend, setDebt }) => {
  // [needDelete, setNeedDelete]=useState(false)
  const { date, title, total, isOwned, lender, ownAmount} = debtInfo;
  const debtId = debtInfo.id

  //  切換detail開闔
  const extendDetail = (e)=>{
    const id = e.target.id
    setExtend((prev)=>{
        return {[id]:!prev[id]} //true-false交換
      })
  }
  //刪除debt列
  //TODO: 這樣寫跟用useEffect有差嗎
  const deleteItem = async(e)=>{
    const confirm = prompt('被刪除的帳將無法復原，若真要刪除，請輸入「刪除」');
    if(confirm !== '刪除'){
      return alert(' 輸入錯誤，再考慮看看唄 ');
    }
    const debtId = Number(e.target.id)

    try{
      const result = await axios.delete(`${constants.API_DELETE_DEBT}${debtId}`) 
      console.log('fetch delete debt: ', result);
      if (result.status !== 200){
        console.log(result);
        return alert(' Something wrong ˊˋ Please try again..')
      }
    }catch(err){
      console.log(err);
      return alert(' Something wrong ˊˋ Please try again..')
    }
    setDebt((prev) => {
      return prev.filter(item => item.id !== debtId)
    })
    // console.log(data);
  }

  return (
    <div className="item">
      <div>
        <li>
        {`日期: ${date} `}
        {`項目: ${title} `}
        {`$NT:${total} `}
        {isOwned}
        {`Paid By: ${lender}`}
        {`${isOwned ? 'You Paid':'You Own'} ${ownAmount}`}
        </li>
      </div>
      <button id={debtId} onClick={extendDetail}>V</button>
      <button id={debtId} onClick={deleteItem}>刪除</button>
    </div>
  );
};

export default DebtList;