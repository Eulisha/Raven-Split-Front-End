import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import constants from '../../../global/constants';
import { User } from '../../App';

const GroupManageButton = ({ currGroup, groupUsers, groupUserNames, groupUserEmails, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged }) => {
  const [editingShow, setEditingShow] = useState(false);

  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        {currGroup ? 'Setting' : '+'} {/* FIXME:這邊要再改 */}
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

// , setGroupUserNames, setGroupUsers, setGroupUserEmails,
const GroupManageWindow = ({ currGroup, groupUsers = [], groupUserNames, groupUserEmails, setIsGroupChanged, show, onHide }) => {
  console.log('Editing Group....');

  let CurrUser = useContext(User);
  // let currUserId = currUser.id;
  // let currUserName = currUser.name; //FIXME:要再套上去
  console.log('currUser', CurrUser);
  console.log('groupUsers', groupUsers);

  //帳的初始值 判斷是新增or編輯

  //設定state
  const [editedGroupUserIds, setEditedGroupUserIds] = useState(groupUsers);
  const [editedGroupUserEmails, setEditedGroupUserEmails] = useState(groupUserEmails);
  console.log('editedGroupUserIds', editedGroupUserIds);
  console.log('editedGroupUserEmails', editedGroupUserEmails);
  // const [editedGroupUserNames, setEditedGroupUserNames] = useState(groupUserNames);
  // console.log('editedGroupUserNames', editedGroupUserNames);

  //設定ref
  const inputGroupName = useRef();
  const inputGroupType = useRef();
  const inputUserEmail = useRef();
  // const inputUserName = useRef();

  //EventHandle
  const handleDeleteUser = (e) => {
    const uid = Number(e.target.id);
    setEditedGroupUserIds((prev) => {
      return prev.filter((user) => user !== uid);
    });
    // setEditedGroupUserNames(() => {
    //   const copy = { ...editedGroupUserNames };
    //   delete copy[uid];
    //   return copy;
    // });
    setEditedGroupUserEmails(() => {
      const copy = { ...editedGroupUserEmails };
      delete copy[uid];
      return copy;
    });
  };
  const handleAddUser = () => {
    const token = localStorage.getItem('accessToken');
    const fetchUser = async () => {
      const { data } = await axios.get(`${constants.API_GET_User_EXIST}?email=${inputUserEmail.current.value}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      //查使用者存在
      const insertId = data.data.id;
      //新增id到array
      setEditedGroupUserIds([...editedGroupUserIds, insertId]);
      // setEditedGroupUserNames({ ...editedGroupUserNames, [insertId]: inputUserName.current.value });
      setEditedGroupUserEmails({ ...editedGroupUserEmails, [insertId]: inputUserEmail.current.value });
      // inputUserName.current.value = '';
      inputUserEmail.current.value = '';
    };
    fetchUser();
  };

  //儲存DB
  const handleSubmit = async () => {
    try {
      //整理送後端格式
      const newGroupUsers = { group_name: inputGroupName.current.value, group_type: inputGroupType.current.value, groupUsers: [] };
      //[{uid:1,name:,email:a@a.com,role:2}]
      editedGroupUserIds.map((userId) => {
        if (!groupUsers.includes(userId)) {
          const newGroupUser = { uid: userId, email: editedGroupUserEmails[userId], role: 2 };
          console.log(newGroupUser);
          newGroupUsers.groupUsers.push(newGroupUser);
        }
      });

      //傳給後端
      const token = localStorage.getItem('accessToken');
      console.log('data for backend:', newGroupUsers);
      let result;
      if (!currGroup) {
        result = await axios.post(`${constants.API_POST_GROUP}`, newGroupUsers, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.log(token, 'put');
        result = await axios.put(`${constants.API_PUT_GROUP}/${currGroup.gid}`, newGroupUsers, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      console.log(result.data);

      //確認有成功後更新state
      if (result.status === 200) {
        setIsGroupChanged((prev) => !prev);
        onHide();
      }
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
          <h4>群組名稱</h4>
          <div id="group_name">
            <input ref={inputGroupName} type="text" defaultValue={currGroup ? currGroup.name : ''}></input>
          </div>
          <h4>群組類型</h4>
          <div id="group_type">
            {currGroup ? (
              <input ref={inputGroupType} type="text" defaultValue={currGroup ? currGroup.type : ''} disabled />
            ) : (
              <input ref={inputGroupType} type="text" defaultValue={currGroup ? currGroup.type : ''} />
            )}
          </div>
          <h4>成員們</h4>
          <div id="group_members">
            <ul>
              {editedGroupUserIds.length > 0 ? (
                editedGroupUserIds.map((uid) => {
                  return (
                    <div key={uid}>
                      {!groupUsers.includes(uid) ? (
                        <div>
                          <div>{`${editedGroupUserEmails[uid]}`}</div>
                          <button id={uid} onClick={handleDeleteUser}>
                            x
                          </button>
                        </div>
                      ) : (
                        <div>{`${groupUserNames[uid]} ${groupUserEmails[uid]}`}</div>
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
              {/* <input ref={inputUserName} id="add_user_name" type="text" placeholder="取個名吧" /> */}
              <input ref={inputUserEmail} id="add_user_email" type="email" placeholder="成員的信箱" />
              {/* <input id="add_user_email" type="text" placeholder="成員的權限" /> */}
              <button onClick={handleAddUser}>+</button>
            </div>
          </div>
        </div>
        {/* {currGroup ? <button>delete group</button> : ''} */}
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

// FIXME:usecontext fail
// import { CurrGroupInfo } from './Home';
// const currGroupInfo = useContext(CurrGroupInfo);
// const currGroup = currGroupInfo.currGroup;
// const groupUsers = currGroupInfo.groupUser;
// const groupUserNames = currGroupInfo.groupUserNames;
// const groupUserEmails = currGroupInfo.groupUserEmails;
