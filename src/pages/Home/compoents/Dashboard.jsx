import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
// import { CurrUser } from '../../App';
import Dashboard_list from './Dashboard_list';

const Dashboard = () => {
  console.log('at dashboard');
  const [selfBalance, setSelfBalance] = useState({});
  console.log('selfBalance', selfBalance);
  // let currUser = useContext(CurrUser);
  // console.log(selfBalance);

  //撈balances
  useEffect(() => {
    console.log('useEffect');
    const fetchSelfBalances = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const result = await axios.get(constants.API_GET_SELF_BALANCES, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(result.data.data);
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
    <div id="self_balance">
      <div id="summary"></div>
      <Dashboard_list selfBalance={selfBalance} />
    </div>
  );
};

export default Dashboard;
