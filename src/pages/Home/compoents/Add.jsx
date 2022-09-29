import axios from 'axios';
import { useState, useEffect, useContext, useRef } from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import currencyFormat from '../../../global/utils';
import Swal from 'sweetalert2';
import { GiReceiveMoney } from 'react-icons/gi';
import validator from '../../../global/validator';

const AddButton = ({ debtInfo, details, setDebt, setDetail, setIsDebtChanged }) => {
  const [editingShow, setEditingShow] = useState(false);
  let CurrGroupInfo = useContext(GroupInfo);
  let { groupUsers } = CurrGroupInfo;
  return (
    <div>
      <Button size="sm" variant="outline-info" onClick={() => setEditingShow(true)}>
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
        date: `${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1 < 10 ? 0 : ''}${new Date(Date.now()).getMonth() + 1}-${new Date(Date.now()).getDate()}`,
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
    const form = formRef.current;
    const formSplit = formSplitRef.current;
    console.log(form, formSplit);
    console.log(form.reportValidity(), formSplit.reportValidity());
    if (form.reportValidity() && formSplit.reportValidity()) {
      console.log(form.reportValidity());
      let splitTotal = 0;

      Object.values(split).map((amount) => {
        splitTotal += Number(amount);
      });
      if (info.total != splitTotal) {
        return Swal.fire({
          title: 'Expense is indivisible ',
          text: `Still NT$${currSum.total - currSum.sum} left. Please check before save.`,
          icon: 'warning',
          confirmButtonText: 'Cool',
        });
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
        console.log(err.response.data.err);
        return Swal.fire({
          title: 'Error!',
          text: err.response.data.err,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      }
    } else {
      console.log('else');
      validator(formRef);
    }
  };

  return (
    <Modal className="window" size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title>How to share expense?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-debt-modal-body">
        <Form noValidate className="add-debt-form" ref={formRef}>
          <Form.Group aria-label="add-debt-form-group">
            <div className="add-debt-form-wrapper">
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
                Title: <Form.Control required type="text" title="title" defaultValue={debtInfo ? debtInfo.title : ''} onChange={handleInfoChange('title')} />
              </Form.Label>
              <Form.Label className="add-debt-form-label-top">
                Total:
                <Form.Control required type="number" min="1" max="100000000" title="total" defaultValue={debtInfo ? debtInfo.total : 0} onChange={handleInfoChange('total')} />
              </Form.Label>
              <Form.Label required className="add-debt-form-label-top">
                Paid By:
                <Form.Select required aria-label="dropdown paid by" title="paid by" className="add-debt-form-label-top" onChange={handleInfoChange('lender')}>
                  <option>{groupUserNames[info.lender]}</option>
                  {groupUsers.map((userId) => {
                    if (userId !== info.lender) return <option value={userId}>{groupUserNames[userId]}</option>;
                  })}
                </Form.Select>
              </Form.Label>
              <Form.Label>
                Split Method
                <Form.Select required aria-label="drop dwon split method" title="split method" onChange={handleInfoChange('split_method')}>
                  <option value={info.split_method} onChange={handleInfoChange('split_method')}>
                    {constants.SPLIT_METHOD[info.split_method]}
                  </option>
                  {Object.keys(constants.SPLIT_METHOD).map((method) => {
                    if (method !== info.split_method) return <option value={method}>{constants.SPLIT_METHOD[method]}</option>;
                  })}
                </Form.Select>
                {/* <span className="warning wording" style={{ fontSize: '12px', color: 'rgb(142 149 161)' }}>
                  ** Automatically round-up to integer if indivisible
                </span> */}
              </Form.Label>
            </div>
          </Form.Group>
        </Form>
        <Form className="add-debt-split-detail-form" noValidate ref={formSplitRef}>
          <Form.Label>Split Debt</Form.Label>
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
                        value={split[uid] ? Number(split[uid]) : 0}
                        onChange={handleSplitChange(Number(uid))}
                      />
                    ) : (
                      <Form.Control
                        required
                        id={Number(uid)}
                        type="number"
                        min="0"
                        max="100000000"
                        aria-label="Amount"
                        value={split[uid] ? Number(split[uid]) : 0}
                        onChange={handleSplitChange(Number(uid))}
                      />
                    )}
                  </InputGroup>
                );
              })}
            </ul>
            <div className="add-debt-total-div">
              <Form.Label className="add-debt-total">Total {currSum.total ? currencyFormat(currSum.total) : ''}</Form.Label>
              <GiReceiveMoney style={{ width: '30px', height: '30px' }} />
              <Form.Label className="add-debt-total">{currencyFormat(currSum.total - currSum.sum)} Left </Form.Label>
            </div>
          </Form.Group>
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
