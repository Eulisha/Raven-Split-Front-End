import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
// import { CurrUser } from '../../App';
import Dashboard_list from './Dashboard_list';

const Dashboard = () => {
  const [selfBalance, setSelfBalance] = useState({});
  console.log(selfBalance);

  //撈balances
  useEffect(() => {
    const fetchSelfBalances = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const result = await axios.get(constants.API_GET_SELF_BALANCES, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (result.status !== 200) {
          console.log(result.error);
        }
        setSelfBalance(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSelfBalances();
  }, []);

  return (
    <div className="self-balance-area">
      <Dashboard_list selfBalance={selfBalance} />
    </div>
  );
};

export default Dashboard;
