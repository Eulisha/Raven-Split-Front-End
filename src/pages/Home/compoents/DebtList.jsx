
const DebtList = ({ id, date, title, total, isOwned, lender, ownAmount, switchExtend, deleteData }) => {

  //  切換detail開闔
  const clickExtend = (e)=>{
    const id = e.target.id
    switchExtend((prev)=>{
        return {[id]:!prev[id]}
      })
  }
  //刪除debt列
  const deleteItem = ()=>{
    deleteData(function(prev) {
      return prev.filter(item => item.id !== id)
    })
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
      <button id={id} onClick={clickExtend}>V</button>
      <button onClick={deleteItem}>刪除</button>
    </div>
  );
};

export default DebtList;