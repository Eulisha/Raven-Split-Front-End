import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import constants from '../../../global/constants';
import { CurrUser } from '../../App';
// import { CurrGroupInfo } from './Home';

const GroupManageButton = ({ currGroup, groupUsers, groupUserNames, groupUserEmails, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged }) => {
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
          setGroupUsers={setGroupUsers}
          setGroupUserNames={setGroupUserNames}
          setGroupUserEmails={setGroupUserEmails}
          setIsGroupChanged={setIsGroupChanged}
          show={editingShow}
          onHide={() => setEditingShow(false)}
        />
      )}
    </div>
  );
};

const GroupManageWindow = ({ currGroup, groupUsers, groupUserNames, groupUserEmails, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged, show, onHide }) => {
  console.log('Editing Group....');
  // const currGroupInfo = useContext(CurrGroupInfo);
  // console.log(currGroupInfo);
  // const currGroup = currGroupInfo.currGroup;
  // const groupUsers = currGroupInfo.groupUser;
  // const groupUserNames = currGroupInfo.groupUserNames;
  // const groupUserEmails = currGroupInfo.groupUserEmails;

  let currUser = useContext(CurrUser);
  // let currUserId = currUser.id;
  let currUserName = currUser.name; //FIXME:要再套上去
  console.log(currUserName);
  console.log(groupUsers);

  //帳的初始值 判斷是新增or編輯

  //設定state
  const [editedGroupUserIds, setEditedGroupUserIds] = useState(currGroup ? groupUsers : []);
  const [editedGroupUserNames, setEditedGroupUserNames] = useState(groupUserNames);
  const [editedGroupUserEmails, setEditedGroupUserEmails] = useState(groupUserEmails);
  console.log('editedGroupUserIds', editedGroupUserIds);
  console.log('editedGroupUserNames', editedGroupUserNames);
  console.log('editedGroupUserEmails', editedGroupUserEmails);

  //設定ref
  const inputGroupName = useRef();
  const inputGroupType = useRef();
  const inputUserName = useRef();
  const inputUserEmail = useRef();
  console.log(setGroupUsers, setGroupUserNames, setGroupUserEmails);

  //EventHandle
  const handleDeleteUser = (e) => {
    const uid = Number(e.target.id);
    setEditedGroupUserIds((prev) => {
      return prev.filter((user) => user !== uid);
    });
    setEditedGroupUserNames(() => {
      const copy = { ...editedGroupUserNames };
      delete copy[uid];
      return copy;
    });
    setEditedGroupUserEmails(() => {
      const copy = { ...editedGroupUserEmails };
      delete copy[uid];
      return copy;
    });
  };
  const handleAddUser = () => {
    //查使用者存在
    const insertId = 14; //FIXME:先寫死
    //新增id到array
    setEditedGroupUserIds([...editedGroupUserIds, insertId]);
    setEditedGroupUserNames({ ...editedGroupUserNames, [insertId]: inputUserName.current.value });
    setEditedGroupUserEmails({ ...editedGroupUserEmails, [insertId]: inputUserEmail.current.value });
  };

  //儲存DB
  const handleSubmit = async () => {
    try {
      //整理送後端格式
      const data = { group_name: inputGroupName.current.value, group_type: inputGroupType.current.value, groupUsers: { uid: 'uid', role: 'role' } }; //FIXME:現在是假的
      //[{uid:1,name:,email:a@a.com,role:2}]

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
      setIsGroupChanged(true);
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
          <h4>群組的名字</h4>
          <div id="group_name">
            <input ref={inputGroupName} type="text" defaultValue={currGroup ? currGroup.name : ''}></input>
          </div>
          {/* <h4>哪種群組呢</h4>
          <div id="group_name">
            群組類型
            <input ref={inputGroupType} type="text" defaultValue={currGroup ? currGroup.type : ''}></input>
          </div> */}
          <h4>成員們</h4>
          <div id="group_members">
            <ul>
              {editedGroupUserIds.length > 0 ? (
                editedGroupUserIds.map((uid) => {
                  return (
                    <div key={uid}>
                      <div>{`${editedGroupUserNames[uid]} (${editedGroupUserEmails[uid]})`}</div>
                      {!groupUsers.includes(uid) ? (
                        <button id={uid} onClick={handleDeleteUser}>
                          x
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                  );
                })
              ) : (
                <div>You</div>
              )}
            </ul>
            <div id="add_user">
              <h4>新增成員</h4>
              <input ref={inputUserName} id="add_user_name" type="text" placeholder="取個名吧" />
              <input ref={inputUserEmail} id="add_user_email" type="email" placeholder="成員的信箱" />
              {/* <input id="add_user_email" type="text" placeholder="成員的權限" /> */}
              <button onClick={handleAddUser}>+</button>
            </div>
          </div>
        </div>
        {currGroup ? <button>delete group</button> : ''}
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
