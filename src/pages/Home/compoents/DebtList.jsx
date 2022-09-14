import axios from 'axios';
import constants from '../../../global/constants';

const DebtList = ({ groupUserNames, debtInfo, setDebt, setExtend }) => {
  const { date, title, total, lender, isOwned, ownAmount } = debtInfo;
  const debtId = debtInfo.id;

  //  切換detail開闔 FIXME:父層需要調整才會有用
  const handleExtend = (e) => {
    console.log('click');
    setExtend(() => {
      const debtId = Number(e.target.id);
      let extendStatus = {};
      extendStatus[debtId] = true;
      console.log(extendStatus);
      return extendStatus; //true-false交換
      // return { [debtId]: !prev[debtId] }; //true-false交換
    });
  };

  //刪除debt列
  const handleDeleteDebt = async (e) => {
    const debtId = Number(e.target.id);
    const confirm = prompt('被刪除的帳將無法復原，若真要刪除，請輸入「刪除」');
    if (confirm !== '刪除') {
      return alert(' 輸入錯誤，再考慮看看唄 ');
    }
    try {
      const result = await axios.delete(`${constants.API_DELETE_DEBT}${debtId}`);
      console.log('fetch delete debt: ', result);
      if (result.status !== 200) {
        console.log(result);
        return alert(' Something wrong ˊˋ Please try again..');
      }
      //刪除成功，set debt
      setDebt((prev) => {
        return prev.filter((item) => item.id !== debtId);
      });
    } catch (err) {
      console.log(err);
      return alert(' Something wrong ˊˋ Please try again..');
    }
  };

  return (
    <div id="debt">
      <div>
        <li>
          {`日期: ${date} `}
          {`項目: ${title} `}
          {`$NT: ${total} `}
          {`Paid By: ${groupUserNames[lender]}`}
          {`${isOwned ? 'You Paid' : 'You Own'} $NT: ${isOwned ? total - ownAmount : ownAmount}`}
        </li>
      </div>
      <button id={debtId} onClick={handleExtend}>
        V
      </button>
      <button id={debtId} onClick={handleDeleteDebt}>
        刪除
      </button>
    </div>
  );
};

export default DebtList;
