import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
// import { CurrUser } from '../../App';
import Dashboard_list from './Dashboard_list';

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
        console.log('BACKEND for setSelfBalance: ', data.data);
        setSelfBalance(data.data);
      } catch (err) {
        console.log(err.response.data.err);
        return alert(err.response.data.err);
      }
    };
    fetchSelfBalances();
  }, [isGroupChanged]);

  // return <div className="self-balance-area">{selfBalance.summary && <Dashboard_list selfBalance={selfBalance} />}</div>;
  return (
    <div className="self-balance-area">
      <Dashboard_list selfBalance={selfBalance} />
    </div>
  );
};

export default Dashboard;
