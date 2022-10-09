import axios from 'axios';
import { useState, useEffect, useContext, useRef } from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import { Page } from './Debts';
import currencyFormat from '../../../global/utils';
import Swal from 'sweetalert2';
import { GiReceiveMoney } from 'react-icons/gi';
// import validator from '../../../global/validator';

const AddButton = ({ debtInfo, details, setDebt, setDetail, setIsDebtChanged }) => {
  const [editingShow, setEditingShow] = useState(false);
  let CurrGroupInfo = useContext(GroupInfo);
  let { groupUsers } = CurrGroupInfo;
  return (
    <div>
      <Button size="sm" variant={details ? 'outline-info' : 'outline-light'} className="add-btn" onClick={() => setEditingShow(true)}>
        {details ? 'Edit' : 'Add Expense'}
      </Button>
      {groupUsers && editingShow && (
        <AddingWindow
          debtInfo={debtInfo}
          details={details}
          setDebt={setDebt}
          setDetail={setDetail}
          setIsDebtChanged={setIsDebtChanged}
          show={editingShow}
          onHide={() => setEditingShow(false)}
        />
      )}
    </div>
  );
};

const AddingWindow = ({ debtInfo, details, setDebt, setDetail, setIsDebtChanged, onHide, show }) => {
  console.log('@ Debt add/edit');

  //Context
  let CurrGroupInfo = useContext(GroupInfo);
  let CurrUser = useContext(User);
  let paging = useContext(Page);

  let currUserId = CurrUser.user.id;
  let currUserName = CurrUser.user.name;
  let gid = CurrGroupInfo.currGroup.gid;
  let { groupUsers, groupUserNames } = CurrGroupInfo;
  console.log('groupUsers, groupUserNames, currUserId, currUserName, gid: ', groupUsers, groupUserNames, currUserId, currUserName, gid);

  //Ref
  const formRef = useRef();
  const formSplitRef = useRef();
  const inputSplitMethod = useRef();

  //設定state for 編輯時暫存的值
  //帳的初始值 判斷是新增or編輯

  const initialInfo = details
    ? debtInfo
    : {
        gid,
        date: `${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${
          new Date(Date.now()).getDate() < 10 ? 0 : ''
        }${new Date(Date.now()).getDate()}`,
        title: '',
        total: 0,
        lender: currUserId,
        split_method: '1',
      };
  const oriSum = details ? { total: debtInfo.total, sum: debtInfo.total } : { total: 0, sum: 0 };
  const oriSplit = details ? details : {};

  const [info, setInfo] = useState(initialInfo);
  const [split, setSplit] = useState(oriSplit); //{uid:amount}
  const [currSum, setSum] = useState(oriSum);

  //Re-Render currSum
  //total
  useEffect(() => {
    const handleSum = (prop) => {
      setSum({ ...currSum, [prop]: info.total });
    };
    handleSum('total');
  }, [info]);
  //subsum
  useEffect(() => {
    const sum = Object.values(split).reduce((acc, curr) => {
      return acc + Number(curr);
    }, 0);
    const handleSum = (prop) => {
      setSum({ ...currSum, [prop]: sum });
    };
    handleSum('sum');
  }, [split]);
  //動態設定平分帳
  useEffect(() => {
    console.log(info, split);
    if (info.split_method === '1') {
      const evenAmount = Math.floor(info.total / groupUsers.length);
      const evenly = {};
      groupUsers.map((user) => {
        evenly[user] = evenAmount;
      });
      setSplit(evenly);
      return;
    }
  }, [info.split_method, info.total]);

  //EventHandle
  const handleInfoChange = (prop) => (e) => {
    if (e.target.name === 'total' || e.target.name === 'amount' || e.target.name === 'lender') {
      setInfo({ ...info, [prop]: currencyFormat(Number(e.target.value)) });
    } else if (e.target.name === 'split_method') {
      console.log(inputSplitMethod.current.value);
      setInfo({ ...info, [prop]: inputSplitMethod.current.value });
    } else {
      setInfo({ ...info, [prop]: e.target.value });
    }
  };
  const handleSplitChange = (prop) => (e) => {
    setSplit({ ...split, [prop]: Number(e.target.value) });
  };
  console.log(split);

  //儲存DB
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('target:', e.target);
    e.target.disabled = true;
    const form = formRef.current;
    const formSplit = formSplitRef.current;

    if (form.reportValidity() && formSplit.reportValidity()) {
      //前端表單驗證正確
      let splitTotal = 0;
      Object.values(split).map((amount) => {
        splitTotal += Number(amount);
      });

      //驗金額
      if (info.total != splitTotal) {
        Swal.fire({
          title: 'Mismatch with Total',
          text:
            currSum.total - currSum.sum > 0
              ? `Still NT$${currSum.total - currSum.sum} left. Please check before save.`
              : `Exceed NT$${currSum.sum - currSum.total}. Please check before save.`,
          icon: 'warning',
          confirmButtonText: 'Cool',
        });
        e.target.disabled = false;
        return;
      }

      try {
        //整理送後端格式
        const newDetails = [];
        groupUsers.map((uid) => {
          if (split[uid]) {
            newDetails.push({ borrower: Number(uid), amount: Number(split[uid]) });
          }
        });
        const data = { debt_main: info, debt_detail: newDetails };
        console.log('FRONTEND for post debt :', data);

        //刪除資料庫用不到的key
        delete info.isOwned;
        delete info.ownAmount;

        //傳給後端
        const token = localStorage.getItem('accessToken');
        let result;
        if (!details) {
          //Add debt
          result = await axios.post(`${constants.API_POST_DEBT}/${gid}`, data, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          onHide();
        } else {
          //Edit debt
          result = await axios.put(`${constants.API_PUT_DEBT}/${gid}/${info.id}`, data, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
        }
        console.log('BACKEND for new info debtId: ', result.data);

        //要把debtId改成新的
        info.id = result.data.data.debtId;
        //整理state data的格式
        info.isOwned = Number(info.lender) === currUserId ? true : false;
        info.ownAmount = Number(info.lender) === currUserId ? info.total - (split[currUserId] ? split[currUserId] : 0) : split[currUserId] ? split[currUserId] : 0;
        if (details) {
          //Edit
          setDebt((prev) => {
            //找到本來的那筆更新
            let newArr = prev.map((item) => {
              if (item.id === debtInfo.id) {
                return info;
              } else {
                return item;
              }
            });
            //排序
            let sorted = newArr.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
            return sorted;
          });
          setDetail(split);
        } else {
          //Add
          setDebt((prev) => {
            //加進去之後再排序
            prev.push(info);
            let sorted = prev.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
            return sorted;
          });
        }
        setIsDebtChanged((prev) => {
          return !prev;
        });
        onHide();
      } catch (err) {
        console.log(err.response);
        if (err.response.status == 404) {
          //帳已經不存在
          Swal.fire({
            title: 'Error!',
            text: 'This debt might already be modified by others, please refresh to get latest one.',
            icon: 'error',
            confirmButtonText: 'Cool',
          }).then(async () => {
            const token = localStorage.getItem('accessToken');
            const { data } = await axios.get(`${constants.API_GET_DEBTS}/${gid}?paging=${paging}`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            console.log('BACKEND for setDebts: ', data.data);
            setDebt(data.data);
            onHide();
          });
        } else if (err.response.data.provider) {
          //後端驗失敗
          //從validator來的error是array形式
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
          e.target.disabled = false;
        } else {
          //系統錯誤
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
          onHide();
        }
        return;
      }
    } else {
      //前端表單驗失敗
      // validator(formRef);
      e.target.disabled = false;
    }
  };

  return (
    <Modal className="window" size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title>How to share expense?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-debt-modal-body">
        <Form noValidate className="add-debt-form" ref={formRef}>
          <Form.Group className="add-debt-form-wrapper">
            <Form.Label className="add-debt-lebel">Expense Info</Form.Label>
            <Form.Label className="add-debt-form-label-top">
              Date:
              <Form.Control
                required
                type="date"
                min="2000-01-01"
                max="2050-12-31"
                title="date"
                defaultValue={debtInfo ? debtInfo.date : info.date}
                onChange={handleInfoChange('date')}
              />
            </Form.Label>
            <Form.Label className="add-debt-form-label-top">
              Title:
              <Form.Control
                required
                type="text"
                title="title"
                placeholder="name of this expense"
                defaultValue={debtInfo ? debtInfo.title : ''}
                onChange={handleInfoChange('title')}
              />
            </Form.Label>
            <Form.Label>
              Split Method
              <Form.Select required aria-label="drop dwon split method" title="split method" onChange={handleInfoChange('split_method')}>
                <option value={info.split_method} onChange={handleInfoChange('split_method')}>
                  {constants.SPLIT_METHOD[info.split_method]}
                </option>
                {Object.keys(constants.SPLIT_METHOD).map((method) => {
                  if (method != info.split_method) return <option value={method}>{constants.SPLIT_METHOD[method]}</option>;
                })}
              </Form.Select>
            </Form.Label>
            <Form.Label className="add-debt-form-label-top">
              Total:
              <Form.Control
                required
                type="number"
                min="1"
                max="100000000"
                title="total"
                placeholder="total of this expense"
                defaultValue={debtInfo ? debtInfo.total : 0}
                onChange={handleInfoChange('total')}
              />
            </Form.Label>
            <Form.Label required className="add-debt-form-label-top">
              Paid By:
              <Form.Select required aria-label="dropdown paid by" title="paid by" className="add-debt-form-label-top" onChange={handleInfoChange('lender')}>
                <option>{groupUserNames[info.lender]}</option>
                {groupUsers.map((userId) => {
                  if (userId != info.lender) return <option value={userId}>{groupUserNames[userId]}</option>;
                })}
              </Form.Select>
            </Form.Label>
          </Form.Group>
        </Form>
        <Form className="add-debt-split-detail-form" noValidate ref={formSplitRef}>
          <div className="add-debt-form-wrapper">
            <Form.Label className="add-debt-lebel">Split Expense</Form.Label>
            <Form.Group>
              <ul className="add-debt-split-detail-list">
                {groupUsers.map((uid) => {
                  return (
                    <InputGroup key={uid} id={uid} className="debt-input">
                      <InputGroup.Text>{groupUserNames[uid]}</InputGroup.Text>
                      <InputGroup.Text>$</InputGroup.Text>
                      {info.split_method == '1' ? (
                        <Form.Control
                          required
                          id={Number(uid)}
                          disabled
                          type="number"
                          min="0"
                          max="100000000"
                          aria-label="Amount"
                          value={split[uid] ? split[uid] : 0}
                          onChange={handleSplitChange(Number(uid))}
                        />
                      ) : (
                        <Form.Control
                          id={Number(uid)}
                          type="number"
                          min="0"
                          max="100000000"
                          aria-label="Amount"
                          defaultValue={split[uid] ? split[uid] : 0}
                          onChange={handleSplitChange(Number(uid))}
                        />
                      )}
                    </InputGroup>
                  );
                })}
              </ul>
              <div className="add-debt-total-div">
                <Form.Label className="add-debt-total">
                  <span>Total</span>
                  <span>{currSum.total ? currencyFormat(currSum.total) : 'NT$ 0'}</span>
                </Form.Label>
                <GiReceiveMoney style={{ width: '30px', height: '30px' }} />
                <Form.Label className="add-debt-total">
                  {currSum.total - currSum.sum >= 0 ? (
                    <>
                      <span>Still Left </span>
                      <span>{currencyFormat(currSum.total - currSum.sum)}</span>
                    </>
                  ) : (
                    <>
                      <span>Exceed </span>
                      <span>{currencyFormat(currSum.sum - currSum.total)}</span>
                    </>
                  )}
                </Form.Label>
              </div>
              {info.split_method == '1' && info.total % groupUsers.length !== 0 && (
                <span className="warning-wording" style={{ fontSize: '12px', color: 'rgb(142 149 161)' }}>
                  Total can't split evenly. <br />
                  Please switch to customize mode to adjust.
                </span>
              )}
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default { AddingWindow, AddButton };
