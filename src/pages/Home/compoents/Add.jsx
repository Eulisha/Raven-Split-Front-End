import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import constants from '../../../global/constants';

const AddButton = ({ currUserId, gid, groupUsers, groupUserNames, debtInfo, details, setDebt, setDetail, setIsDebtChanged }) => {
  const [editingShow, setEditingShow] = useState(false);
  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        新增
      </Button>
      {editingShow && (
        <AddingWindow /** 編輯視窗 */
          currUserId={currUserId}
          gid={gid}
          groupUsers={groupUsers}
          groupUserNames={groupUserNames}
          debtInfo={debtInfo}
          details={details}
          setDebt={setDebt}
          setDetail={setDetail}
          setIsDebtChanged={setIsDebtChanged}
          show={editingShow}
          onHide={() => setEditingShow(false)}
          state="editing"
        />
      )}
    </div>
  );
};

const AddingWindow = ({ currUserId, gid, groupUsers, groupUserNames, debtInfo, details, setDebt, setDetail, setIsDebtChanged, onHide, show, state }) => {
  console.log('Editing....');
  //帳的初始值 判斷是新增or編輯
  const initialInfo = details
    ? debtInfo
    : {
        gid,
        date: `${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1}-${new Date(Date.now()).getDate()}`,
        title: '',
        total: 0,
        lender: currUserId,
        split_method: 1,
      };
  const oriSum = details ? { total: debtInfo.total, sum: debtInfo.total } : { total: 0, sum: 0 };
  const oriSplit = details ? details : {};

  //設定state
  const [info, setInfo] = useState(initialInfo);
  const [split, setSplit] = useState(oriSplit); //{uid:amount}
  const [currSum, setSum] = useState(oriSum);
  // const [isSave, setIsSave] = useState(false);

  console.log('set info: ', info);
  console.log('set splitValue: ', split);
  console.log('set splitsummarize: ', currSum);

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

  //EventHandle
  const handleInfoChange = (prop) => (e) => {
    if (e.target.name === 'total' || e.target.name === 'amount') {
      setInfo({ ...info, [prop]: Number(e.target.value) });
    } else {
      setInfo({ ...info, [prop]: e.target.value });
    }
    console.log('updated info:', info);
  };
  const handleSplitChange = (prop) => (e) => {
    setSplit({ ...split, [prop]: Number(e.target.value) });
  };

  //儲存DB
  const handleSubmit = async () => {
    try {
      //整理送後端格式
      const newDetails = [];
      groupUsers.map((uid) => {
        console.log('uid type', split[uid], typeof split[uid]);
        if (split[uid]) {
          newDetails.push({ borrower: Number(uid), amount: Number(split[uid]) });
        }
      });
      const data = { debt_main: info, debt_detail: newDetails };
      console.log('data for fetch:', data);

      //傳給後端
      const token = localStorage.getItem('accessToken');
      let result;
      if (!details) {
        result = await axios.post(`${constants.API_POST_DEBT}/${gid}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.log(token, 'put');
        result = await axios.put(`${constants.API_PUT_DEBT}/${gid}/${info.id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      console.log(result.data);

      // //確認有成功後更新state
      if (result.status === 200) {
        setInfo((prev) => {
          console.log(prev['id']);
          prev['id'] = result.data.data.debtId; //儲存之後會有新的debtId, 要額外更新上去
        });

        //整理state data的格式
        info.isOwned = info.lender === currUserId ? true : false;
        //FIXME: 要取表單裡的值;
        info.ownAmount = info.lender === currUserId ? info.total - (split[currUserId] ? split[currUserId] : 0) : split[currUserId] ? split[currUserId] : 0;
        //FIXME: 要取表單裡的值;
        console.log('info: ', info);
        console.log('split: ', split);
        setDebt((prev) => {
          console.log(prev);
          return [info, ...prev];
        });
        if (details) {
          setDetail(split); //FIXME:要確認
        }
        setIsDebtChanged(true);
        onHide();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal className="window" size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{state === 'editing' ? '你正在新增' : '你正在新增文章'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h3>帳怎麼分呢？</h3>
          <h4>費用</h4>
          <ul>
            <li>
              Date: <input type="date" defaultValue={debtInfo ? debtInfo.date : info.date} onChange={handleInfoChange('date')}></input>
            </li>
            <li>
              Title: <input type="text" name="title" defaultValue={debtInfo ? debtInfo.title : ''} onChange={handleInfoChange('title')}></input>
            </li>
            <li>
              Total: <input type="number" name="total" defaultValue={debtInfo ? debtInfo.total : 0} onChange={handleInfoChange('total')}></input>
            </li>
            <li>
              Paid By: <input type="text" defaultValue={debtInfo ? debtInfo.lender : currUserId} onChange={handleInfoChange('lender')}></input>
            </li>
            <li>
              Split Method<input type="number" defaultValue={debtInfo ? debtInfo.split_method : 1} onChange={handleInfoChange('split_method')}></input>
            </li>
          </ul>
          <h4>費用拆分</h4>
          <div>
            <ul>
              {groupUsers.map((uid) => {
                return (
                  <li key={uid}>
                    {`${groupUserNames[uid]} ${'owns'} `}
                    <input id={Number(uid)} type="number" defaultValue={split[uid] ? Number(split[uid]) : null} onChange={handleSplitChange(Number(uid))}></input>
                  </li>
                );
              })}
            </ul>
            <ul>
              總共{currSum.total}，還剩{currSum.total - currSum.sum}
            </ul>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSubmit}>
          {' '}
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default { AddingWindow, AddButton };
