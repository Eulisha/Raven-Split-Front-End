import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import DetailList from './DetailList';
// import Edit from './Edit';
import Add from './Add';

const Details = ({ gid, groupUsers, groupUserNames, debtInfo, extend, setDebt, setIsDebtChanged }) => {
  console.log('@Details');
  const debtId = debtInfo.id;
  const [details, setDetail] = useState({});

  //撈debt_details
  useEffect(() => {
    // if (extend[debtId]) {
    const fetchDetail = async (debtId) => {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios(`${constants.API_GET_DEBT_DETAILS}/${gid}/${debtId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      //整理成快速查找的object, oriSplit = {1:50, 2:50}
      console.log(data.data);

      console.log('debug map');
      const oriSplit = {};
      data.data.map((detail) => {
        console.log('borrow', detail.borrower);
        for (let uid of groupUsers) {
          console.log('uid', uid);
          if (uid === detail.borrower) {
            console.log('true');
            oriSplit[uid] = detail.amount;
            break;
          }
        }
      });
      setDetail(oriSplit);
      console.log('set details: ', oriSplit);
    };
    fetchDetail(debtId);
    // }
  }, [extend]);

  return (
    <div>
      <DetailList key="detail-list" details={details} groupUserNames={groupUserNames} />
      <Add.AddButton
        key="update"
        className="edit"
        gid={gid}
        groupUsers={groupUsers}
        groupUserNames={groupUserNames}
        debtInfo={debtInfo}
        details={details}
        setDebt={setDebt}
        setDetail={setDetail}
        setIsDebtChanged={setIsDebtChanged}
      />
    </div>
  );
};

export default Details;
