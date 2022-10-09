import { useEffect, useContext, useState } from 'react';
import React from 'react';
import axios from 'axios';
import constants from '../../../global/constants';
import Details from './Details';
import DebtList from './DebtList';
import { Accordion } from 'react-bootstrap';
import { GroupInfo } from './Home';
import { Pagination } from '@mui/material';
import Swal from 'sweetalert2';

export const Page = React.createContext();

const Debts = ({ debts, isDebtChanged, setDebt, setIsDebtChanged }) => {
  console.log('@Debts');

  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUsers } = CurrGroupInfo;

  const [paging, setPaging] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  //撈debts
  useEffect(() => {
    const fetchDebts = async (gid) => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${constants.API_GET_DEBTS}/${gid}?paging=${paging}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log('BACKEND for setDebts: ', data.data);
        setDebt(data.data);
      } catch (err) {
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    if (currGroup.gid) {
      fetchDebts(currGroup.gid);
    }
  }, [currGroup, isDebtChanged, paging]);

  //撈pages
  useEffect(() => {
    const fetchDebtPages = async (gid) => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${constants.API_GET_DEBT_PAGES}/${gid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setPaging: ', data.data);
        setPageCount(data.data.pageCount);
      } catch (err) {
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    if (currGroup.gid) {
      fetchDebtPages(currGroup.gid);
    }
  }, [currGroup, isDebtChanged, paging]);

  return (
    <Page.Provider value={paging}>
      <div id="debts_column">
        <div className="debt-top-bar">
          Expense List
          {/* <RiUserSettingsLine style={{ marginLeft: '10px' }} /> */}
        </div>
        {debts.length > 0 &&
          groupUsers.length > 0 &&
          debts.map((debt) => {
            return (
              <>
                <Accordion key={debt.id}>
                  <Accordion.Item key={debt.id} id={debt.id} className="debt_list" eventKey="1">
                    <Accordion.Header id={debt.id}>
                      <DebtList debtInfo={debt} setDebt={setDebt} />
                    </Accordion.Header>
                    <Accordion.Body>
                      <Details id="details" debts={debts} debtInfo={debt} setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            );
          })}
        <Pagination
          count={pageCount}
          page={paging}
          onChange={(e, page) => {
            setPaging(page);
          }}
        />
      </div>
    </Page.Provider>
  );
};

export default Debts;
//
