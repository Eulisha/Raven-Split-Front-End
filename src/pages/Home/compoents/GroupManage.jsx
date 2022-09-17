import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import constants from '../../../global/constants';
// import { CurrGroupInfo } from './Home';

const GroupManageButton = ({ currGroup, groupUsers, groupUserNames, groupUserEmails }) => {
  const [editingShow, setEditingShow] = useState(false);
  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        {currGroup ? '編輯' : '新增'} {/* FIXME:這邊要再改 */}
      </Button>
      {editingShow && (
        <GroupManageWindow
          /** 編輯視窗 */ currGroup={currGroup}
          groupUsers={groupUsers}
          groupUserNames={groupUserNames}
          groupUserEmails={groupUserEmails}
          show={editingShow}
          onHide={() => setEditingShow(false)}
        />
      )}
    </div>
  );
};

const GroupManageWindow = ({ currGroup, groupUsers, groupUserNames, groupUserEmails, show, onHide }) => {
  console.log('Editing Group....');
  // const currGroupInfo = useContext(CurrGroupInfo);
  // console.log(currGroupInfo);
  // const currGroup = currGroupInfo.currGroup;
  // const groupUsers = currGroupInfo.groupUser;
  // const groupUserNames = currGroupInfo.groupUserNames;
  // const groupUserEmails = currGroupInfo.groupUserEmails;

  //帳的初始值 判斷是新增or編輯

  //設定state

  //EventHandle
  //儲存DB
  const handleSubmit = async () => {
    try {
      //整理送後端格式
      const data = {};
      //傳給後端
      const token = localStorage.getItem('accessToken');
      let result;
      if (!currGroup) {
        result = await axios.post(`${constants.API_POST_DEBT}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.log(token, 'put');
        result = await axios.put(`${constants.API_PUT_DEBT}/${currGroup.gid}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      console.log(result.data);

      // //確認有成功後更新state
      // if (result.status === 200) {
      //   setInfo((prev) => {
      //     console.log(prev['id']);
      //     prev['id'] = result.data.data.debtId; //儲存之後會有新的debtId, 要額外更新上去
      //   });

      //   //整理state data的格式
      //   info.isOwned = info.lender === currUserId ? true : false;
      //   //FIXME: 要取表單裡的值;
      //   info.ownAmount = info.lender === currUserId ? info.total - (split[currUserId] ? split[currUserId] : 0) : split[currUserId] ? split[currUserId] : 0;
      //   //FIXME: 要取表單裡的值;
      //   setDebt((prev) => {
      //     console.log(prev);
      //     return [info, ...prev];
      // });
      // if (details) {
      //   setDetail(split); //FIXME:要確認
      // }
      // setIsDebtChanged(true);
      onHide();
      // }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal className="window" size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...{ onHide, show }}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{currGroup === 'editing' ? '你正在編輯' : '你正在新增'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h4>給個名字吧</h4>
          <div>
            群組的名字
            <input type="text" defaultValue={currGroup ? currGroup.name : ''}></input>
          </div>
          <h4>成員們</h4>
          <div>
            <ul>
              {currGroup
                ? groupUsers.map((uid) => {
                    return (
                      <div key={uid}>
                        <div>{`${groupUserNames[uid]} (${groupUserEmails[uid]})`}</div>
                        <button>x</button>
                      </div>
                    );
                  })
                : ''}
            </ul>
            <div id="add_user">
              <input id="add_user_name" type="text" placeholder="取個名吧" />
              <input id="add_user_email" type="email" placeholder="成員的信箱是啥" />
            </div>
          </div>
        </div>
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

export default { GroupManageWindow, GroupManageButton };
