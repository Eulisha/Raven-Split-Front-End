const DebtList = ({ id, date, title, total, isOwned, lender, ownAmount, switchExtend, deleteData }) => {

  function clickExtend(e){
    console.log('clicked:', e.target.id);
    const id = e.target.id
    switchExtend((prev)=>{
        console.log('prev:  ',prev);
        return {[id]:!prev[id]}
      })
  }
  function deleteItem() {
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
      <button id={id} onClick={clickExtend} className="remove">V</button>
      <button onClick={deleteItem} className="remove">刪除</button>
    </div>
  );
};

export default DebtList;