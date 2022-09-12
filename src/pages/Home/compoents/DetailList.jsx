const DetailList = ({ id, isOwned, borrower, amount }) => {
  return (
    <div key={id} className="item">
      <li>{`${borrower}${isOwned ? 'paid' : 'owns'} ${amount}`}</li>
    </div>
  );
};
export default DetailList;
