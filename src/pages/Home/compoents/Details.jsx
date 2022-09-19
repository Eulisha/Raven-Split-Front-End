import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import DetailList from './DetailList';
// import Edit from './Edit';
import Add from './Add';
import { GroupInfo } from './Home';

const Details = ({ debtInfo, setDebt, setIsDebtChanged }) => {
  console.log('@Details');
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUsers } = CurrGroupInfo;
  let gid = currGroup.gid;
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

      const oriSplit = {};
      data.data.map((detail) => {
        for (let uid of groupUsers) {
          if (uid === detail.borrower) {
            oriSplit[uid] = detail.amount;
            break;
          }
        }
      });
      setDetail(oriSplit);
      console.log('set details: ', oriSplit);
    };
    let detailsKeys = Object.keys(details);
    console.log('**********@Details', 'groupUsers.len:', groupUsers.length, 'detailsKeys.len:', detailsKeys.length);
    if (groupUsers.length > 0 && detailsKeys.length === 0) {
      console.log('@Details', 'fetchDetail', debtId);
      fetchDetail(debtId);
    }
    // }
  }, [groupUsers]);

  return (
    <div>
      <DetailList key="detail-list" details={details} />
      <Add.AddButton key="update" className="edit" debtInfo={debtInfo} details={details} setDebt={setDebt} setDetail={setDetail} setIsDebtChanged={setIsDebtChanged} />
    </div>
  );
};

export default Details;
