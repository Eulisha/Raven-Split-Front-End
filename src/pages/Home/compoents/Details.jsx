import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import constants from '../../../global/constants';
import DetailList from './DetailList';
import Button from 'react-bootstrap/Button';
import Add from './Add';
import { GroupInfo } from './Home';
import { Page } from './Debts';
import Swal from 'sweetalert2';

const Details = ({ debtInfo, setDebt, setIsDebtChanged }) => {
  //Context
  let CurrGroupInfo = useContext(GroupInfo);
  let paging = useContext(Page);

  let { currGroup, groupUsers } = CurrGroupInfo;
  let gid = currGroup.gid;
  const debtId = debtInfo.id;

  //State
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

        //整理成以uid為key的object
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
      } catch (err) {
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Oops!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    let detailsKeys = Object.keys(details);
    if (groupUsers.length > 0 && detailsKeys.length === 0) {
      fetchDetail(debtId);
    }
  }, []);

  //刪除debt列
  const handleDeleteDebt = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Loading...',
          showConfirmButton: false,
          allowOutsideClick: () => !Swal.isLoading(),
          didOpen: async () => {
            Swal.showLoading();
            try {
              const token = localStorage.getItem('accessToken');
              await axios.delete(`${constants.API_DELETE_DEBT}/${currGroup.gid}/${debtId}`, {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              });

              //刪除成功
              setTimeout(() => {
                setDebt((prev) => {
                  return prev.filter((item) => item.id !== debtId);
                });
                setIsDebtChanged((prev) => {
                  return !prev;
                });
                Swal.hideLoading();
                Swal.close();
                Swal.fire({ title: 'Deleted!', icon: 'success', showConfirmButton: false, timer: 1200 });
              }, 500);
            } catch (err) {
              if (!err.response.data) {
                //網路錯誤
                Swal.fire({
                  title: 'Oops!',
                  text: 'Network Connection failed, please try later...',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              } else if (err.response.status == 404) {
                //帳已經不存在
                return Swal.fire({
                  title: 'Oops!',
                  text: 'This debt might already be modified by others, please refresh to get latest one.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                }).then(async () => {
                  const token = localStorage.getItem('accessToken');
                  const { data } = await axios.get(`${constants.API_GET_DEBTS}/${gid}?paging=${paging}`, {
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  });
                  setDebt(data.data);
                });
              } else if (err.response.status == 503) {
                return Swal.fire({
                  title: 'Oops!',
                  text: err.response.data.err,
                  icon: 'info',
                  confirmButtonText: 'OK',
                });
              } else {
                return Swal.fire({
                  title: 'Oops!',
                  text: 'Internal Server Error',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              }
            }
          },
        });
      }
    });
  };

  return (
    <div>
      <DetailList key="detail-list" details={details} />
      <div className="detail-list-buttons">
        {debtInfo.title.includes('Settle Balances Between') ? (
          ''
        ) : (
          <Add.AddButton key="update" className="edit" debtInfo={debtInfo} details={details} setDebt={setDebt} setDetail={setDetail} setIsDebtChanged={setIsDebtChanged} />
        )}
        <Button size="sm" variant="outline-danger" id={debtId} onClick={handleDeleteDebt}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default Details;
