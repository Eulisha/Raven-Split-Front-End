import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import DetailList from './DetailList';
import Button from 'react-bootstrap/Button';
// import Edit from './Edit';
import Add from './Add';
import { GroupInfo } from './Home';
import Swal from 'sweetalert2';

const Details = ({ debtInfo, setDebt, setIsDebtChanged }) => {
  console.log('@Details');
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUsers } = CurrGroupInfo;
  let gid = currGroup.gid;
  const debtId = debtInfo.id;
  const [details, setDetail] = useState({});

  //撈debt_details
  useEffect(() => {
    const fetchDetail = async (debtId) => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios(`${constants.API_GET_DEBT_DETAILS}/${gid}/${debtId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setDetails: ', data.data);

        //整理成快速查找的object, oriSplit = {1:50, 2:50}
        const oriSplit = {};
        data.data.map((detail) => {
          for (let uid of groupUsers) {
            if (uid === detail.borrower) {
              oriSplit[uid] = detail.amount;
              break;
            }
          }
        });
        console.log('整理好最後用來setDetails: ', oriSplit);
        setDetail(oriSplit);
      } catch (err) {
        console.log(err.response.data.err);
        return Swal.fire({
          title: 'Error!',
          text: err.response.data.err,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      }
    };
    let detailsKeys = Object.keys(details);
    if (groupUsers.length > 0 && detailsKeys.length === 0) {
      fetchDetail(debtId);
    }
  }, []);

  //刪除debt列
  const handleDeleteDebt = async () => {
    // const debtId = Number(e.target.id);
    const confirm = prompt('被刪除的帳將無法復原，若真要刪除，請輸入「刪除」');
    if (confirm !== '刪除') {
      s;
      return Swal.fire({
        title: 'Error!',
        text: '輸入錯誤，再考慮看看唄',
        icon: 'error',
        confirmButtonText: 'Cool',
      });
    }

    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.delete(`${constants.API_DELETE_DEBT}/${currGroup.gid}/${debtId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('BACKEND for delete setDebt: ', data.data);
      //刪除成功，set debt
      setDebt((prev) => {
        return prev.filter((item) => item.id !== debtId);
      });
      setIsDebtChanged((prev) => {
        return !prev;
      });
    } catch (err) {
      console.log(err.response.data.err);
      return Swal.fire({
        title: 'Error!',
        text: err.response.data.err,
        icon: 'error',
        confirmButtonText: 'Cool',
      });
    }
  };

  return (
    <div>
      <DetailList key="detail-list" details={details} />
      <div className="detail-list-buttons">
        <Add.AddButton key="update" className="edit" debtInfo={debtInfo} details={details} setDebt={setDebt} setDetail={setDetail} setIsDebtChanged={setIsDebtChanged} />
        <Button size="sm" variant="outline-danger" id={debtId} onClick={handleDeleteDebt}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default Details;
