import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import DetailList from './DetailList';
// import Edit from './Edit';
import Add from './Add';

const Details = ({ gid, groupUsers, groupUserNames, debtInfo, extend, setDebt }) => {
  const debtId = debtInfo.id;
  const [details, setDetail] = useState({});

  //撈debt_details
  useEffect(() => {
    if (extend[debtId]) {
      const fetchDetail = async (debtId) => {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios(`${constants.API_GET_DEBT_DETAILS}/${gid}/${debtId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        //整理成快速查找的object, oriSplit = {1:50, 2:50}
        const oriSplit = {};
        groupUsers.map((uid) => {
          data.data.map((detail) => {
            if (uid === detail.borrower) {
              oriSplit[uid] = detail.amount;
            } else {
              oriSplit[uid] = null;
            }
          });
        });
        setDetail(oriSplit);
        console.log('set details: ', oriSplit);
      };
      fetchDetail(debtId);
    }
  }, [extend]);

  return (
    <div>
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
      />
      <DetailList key="detail-list" details={details} groupUserNames={groupUserNames} />;
    </div>
  );
};

export default Details;
