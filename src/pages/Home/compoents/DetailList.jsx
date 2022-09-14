const DetailList = ({ details, groupUserNames }) => {
  {
    Object.keys(details).map((borrowerId) => {
      return (
        <div key={borrowerId} className="item">
          <li>{`${groupUserNames[borrowerId]} owns ${details[borrowerId]}`}</li>
        </div>
      );
    });
  }
};
export default DetailList;
