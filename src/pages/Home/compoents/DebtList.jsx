// import axios from 'axios';
// import constants from '../../../global/constants';
// import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { GroupInfo } from './Home';

const DebtList = ({ debtInfo }) => {
  console.log('@DebtList');
  let CurrGroupInfo = useContext(GroupInfo);
  let { groupUserNames } = CurrGroupInfo;
  const { date, title, total, lender, isOwned, ownAmount } = debtInfo;
  console.log('total:', total, 'isOwned', isOwned, 'ownAmount', ownAmount);
  // const debtId = debtInfo.id;

  //  切換detail開闔
  // const handleExtend = (e) => {
  //   console.log('click');
  //   setExtend(() => {
  //     const debtId = Number(e.target.id);
  //     let extendStatus = {};
  //     extendStatus[debtId] = true;
  //     console.log(extendStatus);
  //     return extendStatus; //true-false交換
  //     // return { [debtId]: !prev[debtId] }; //true-false交換
  //   });
  // };

  return (
    <div id="debt">
      <div>
        <div className="date">{`${date} `}</div>
        <div className="description">{`項目: ${title} `}</div>
        <div className="cost">
          <span>{`Paid By: ${groupUserNames[lender]}`}</span>
          <span>{`$NT: ${total} `}</span>
        </div>
        <div className="you">{`${isOwned ? 'You Paid' : 'You Own'} $NT: ${ownAmount}`}</div>
      </div>
      {/* <button id={debtId} onClick={handleExtend}>
        V
      </button> */}
    </div>
  );
};

export default DebtList;
