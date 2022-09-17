import axios from 'axios';
import constants from '../../../global/constants';
import Button from 'react-bootstrap/Button';

// , setExtend
const DebtList = ({ gid, groupUserNames, debtInfo, setDebt }) => {
  const { date, title, total, lender, isOwned, ownAmount } = debtInfo;
  const debtId = debtInfo.id;

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

  //刪除debt列
  const handleDeleteDebt = async (e) => {
    const debtId = Number(e.target.id);
    const confirm = prompt('被刪除的帳將無法復原，若真要刪除，請輸入「刪除」');
    if (confirm !== '刪除') {
      return alert(' 輸入錯誤，再考慮看看唄 ');
    }
    try {
      const token = localStorage.getItem('accessToken');
      const result = await axios.delete(`${constants.API_DELETE_DEBT}/${gid}/${debtId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
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
        <div className="date">{`${date} `}</div>
        <div className="description">{`項目: ${title} `}</div>
        <div className="cost">
          <span>{`Paid By: ${groupUserNames[lender]}`}</span>
          <span>{`$NT: ${total} `}</span>
        </div>
        <div className="you">{`${isOwned ? 'You Paid' : 'You Own'} $NT: ${isOwned ? total - ownAmount : ownAmount}`}</div>
      </div>
      {/* <button id={debtId} onClick={handleExtend}>
        V
      </button> */}
      <Button closeButton variant="outline-secondary" id={debtId} onClick={handleDeleteDebt}></Button>
    </div>
  );
};

export default DebtList;
