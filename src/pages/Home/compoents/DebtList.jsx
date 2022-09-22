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

  return (
    <div className="debt-header">
      <div className="debt-items-left">
        <div className="date debt-item">{`${date} `}</div>
        <div className="description debt-item">{`${title} `}</div>
      </div>
      <div className="debt-items-right">
        <div className="cost debt-item-pay-by">
          <span className="paid-by">{`${groupUserNames[lender]} paid`}</span>
          <span className="paid-by debt-item-amount">{`NT$ ${total} `}</span>
        </div>
        <div className="cost debt-item-you">
          <span className="you">{`${isOwned ? 'You Paid' : 'You Own'}`}</span>
          {isOwned ? <span className="you debt-item-amount owned-font">{`NT$ ${ownAmount}`}</span> : <span className="you debt-item-amount own-font">{`NT$ ${ownAmount}`}</span>}
        </div>
      </div>
    </div>
  );
};

export default DebtList;
