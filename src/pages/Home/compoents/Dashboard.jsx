import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import Dashboard_list from './Dashboard_list';
import Swal from 'sweetalert2';

const Dashboard = (isGroupChanged) => {
  const [selfBalance, setSelfBalance] = useState({});

  //撈balances
  useEffect(() => {
    const fetchSelfBalances = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(constants.API_GET_SELF_BALANCES, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setSelfBalance(data.data);
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
    fetchSelfBalances();
  }, [isGroupChanged]);

  return (
    <div className="self-balance-area">
      <Dashboard_list selfBalance={selfBalance} />
    </div>
  );
};

export default Dashboard;
