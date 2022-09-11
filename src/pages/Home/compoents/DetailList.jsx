const DetailList = ({ id, isOwned, borrower, amount }) => {
  return (
    <div key={id} className="item">
      <div>
        <li>
        {`${borrower}${isOwned ? 'paid':'owns'} ${amount}`}        
        </li>
      </div>
    </div>
    
  );
};
export default DetailList