// import axios from 'axios';
// import constants from '../../../global/constants';
// import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { GroupInfo } from './Home';
import { User } from '../../App';
import utils from '../../../global/utils';

const DebtList = ({ debtInfo }) => {
  console.log('@DebtList');
  let CurrGroupInfo = useContext(GroupInfo);
  let CurrUser = useContext(User);
  let currUserId = CurrUser.user.id;
  let { groupUserNames } = CurrGroupInfo;
  const { date, title, total, lender, isOwned, ownAmount } = debtInfo;

  return (
    <div className="debt-header">
      <div className="debt-items-left">
        <div className="date debt-item">{`${date.replace('2022-', '').replace('-', '/')} `}</div>
        <div className="description debt-item">{`${title} `}</div>
      </div>
      <div className="debt-items-right">
        <div className="cost debt-item-pay-by">
          <span className="paid-by">{lender === currUserId ? 'You paid' : `${groupUserNames[lender]} paid`}</span>
          <span className="paid-by debt-item-amount">{utils.currencyFormat(total)}</span>
        </div>
        <div className="cost debt-item-you">
          {isOwned === null ? (
            <span className="you debt-item-not-involved">Not Involved</span>
          ) : (
            <>
              <span className="you">{`${isOwned === true ? 'You Lent' : `${groupUserNames[lender]} Lent You`}`}</span>
              {isOwned ? (
                <span className="you debt-item-amount owed-font">{utils.currencyFormat(ownAmount)}</span>
              ) : (
                <span className="you debt-item-amount owe-font">{utils.currencyFormat(ownAmount)}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtList;
