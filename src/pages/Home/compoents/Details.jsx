import axios from 'axios';
import { useState, useEffect } from 'react';
import constants from '../../../global/constants';
import DetailList from './DetailList';
import Edit from './Edit';

const Details = ({ gid, debtInfo, debts, members, extend, setDebt }) => {
  const [details, setDetail] = useState([]);
  const debtId = debtInfo.id;

  useEffect(() => {
    if (extend[debtId]) {
      const fetchDetail = async (debtId) => {
        const { data } = await axios(`${constants.API_GET_DEBT_DETAILS}${debtId}`);
        console.log('fetch data details: ', data);
        setDetail(data.data);
        console.log('set details: ', data.data);
      };
      fetchDetail(debtId);
    }
  }, [extend]);

  return (
    <div>
      <Edit.EditButton key="update" className="edit" gid={gid} debtInfo={debtInfo} debts={debts} details={details} members={members} setDetail={setDetail} setDebt={setDebt} />
      {details.map((item) => {
        const { id, borrower, amount } = item;
        return <DetailList key={id} id={id} borrower={borrower} amount={amount} debtInfo={debtInfo} />;
      })}
    </div>
  );
};

export default Details;
