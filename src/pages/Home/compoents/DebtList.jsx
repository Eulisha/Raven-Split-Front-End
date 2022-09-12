import axios from 'axios';
import { useEffect } from 'react';
import constants from '../../../global/constants';

const DebtList = ({ debtInfo, setExtend, setDebt, isSettle }) => {
  const { date, title, total, isOwned, lender, ownAmount } = debtInfo;
  const debtId = debtInfo.id;

  //  切換detail開闔
  const extendDetail = (e) => {
    const id = e.target.id;
    setExtend((prev) => {
      return { [id]: !prev[id] }; //true-false交換
    });
  };

  useEffect(() => {
    setExtend(false);
  }, [isSettle]);

  //刪除debt列
  const deleteItem = async (e) => {
    const confirm = prompt('被刪除的帳將無法復原，若真要刪除，請輸入「刪除」');
    if (confirm !== '刪除') {
      return alert(' 輸入錯誤，再考慮看看唄 ');
    }
    const debtId = Number(e.target.id);
    try {
      const result = await axios.delete(`${constants.API_DELETE_DEBT}${debtId}`);
      console.log('fetch delete debt: ', result);
      if (result.status !== 200) {
        console.log(result);
        return alert(' Something wrong ˊˋ Please try again..');
      }
      setDebt((prev) => {
        return prev.filter((item) => item.id !== debtId);
      });
    } catch (err) {
      console.log(err);
      return alert(' Something wrong ˊˋ Please try again..');
    }
    // console.log(data);
  };

  return (
    <div className="item">
      <div>
        <li>
          {`日期: ${date} `}
          {`項目: ${title} `}
          {`$NT:${total} `}
          {isOwned}
          {`Paid By: ${lender}`}
          {`${isOwned ? 'You Paid' : 'You Own'} ${ownAmount}`}
        </li>
      </div>
      <button id={debtId} onClick={extendDetail}>
        V
      </button>
      <button id={debtId} onClick={deleteItem}>
        刪除
      </button>
    </div>
  );
};

export default DebtList;
