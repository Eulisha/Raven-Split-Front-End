import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';

const GroupManageButton = ({ location, setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged }) => {
  const [editingShow, setEditingShow] = useState(false);

  return (
    <div className="blog__controller">
      <Button variant="outline-success" onClick={() => setEditingShow(true)}>
        {location === 'group_users' ? 'Setting' : '+'}
      </Button>
      {editingShow && (
        <GroupManageWindow
          /** 編輯視窗 */
          location={location}
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

const GroupManageWindow = ({ location, setIsGroupChanged, show, onHide }) => {
  console.log('Editing Group....');

  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let { id, name, email } = CurrUser.user;
  let { currGroup, groupUsers, groupUserNames, groupUserEmails } = CurrGroupInfo;

  console.log('currUser', CurrUser);
  console.log('groupUsers', groupUsers);
  console.log('currGroup', currGroup);
  console.log(location);
  let group_type;

  switch (location) {
    case 'group_normal':
      group_type = '1';
      break;
    case 'group_pair':
      group_type = '2';
      break;
    case 'group_buying':
      group_type = '3';
      break;
    case 'group_users':
      group_type = currGroup.type;
      break;
  }
  console.log(group_type);

  //設定state
  const [editedGroupUserIds, setEditedGroupUserIds] = useState(location === 'group_users' ? groupUsers : [id]);
  const [editedGroupUserEmails, setEditedGroupUserEmails] = useState(location === 'group_users' ? groupUserEmails : { [id]: email });
  console.log('editedGroupUserIds', editedGroupUserIds);
  console.log('editedGroupUserEmails', editedGroupUserEmails);

  //設定ref
  const inputGroupName = useRef();
  const inputUserEmail = useRef();

  //EventHandle
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
      setEditedGroupUserEmails({ ...editedGroupUserEmails, [insertId]: inputUserEmail.current.value });
      inputUserEmail.current.value = '';
    };
    fetchUser();
  };

  const handleDeleteUser = (e) => {
    const uid = Number(e.target.id);
    setEditedGroupUserIds((prev) => {
      return prev.filter((user) => user !== uid);
    });
    setEditedGroupUserEmails(() => {
      const copy = { ...editedGroupUserEmails };
      delete copy[uid];
      return copy;
    });
  };

  //儲存DB
  const handleSubmit = async () => {
    try {
      //整理送後端格式
      const newGroupUsers = { group_name: inputGroupName.current.value, group_type, groupUsers: [] };
      //[{uid:1,email:a@a.com,role:2}]

      if (location === 'group_users') {
        //新增群組時需將自己加入arr
        newGroupUsers.groupUsers.push({ uid: id, email, role: '4' });
      }
      editedGroupUserIds.map((userId) => {
        if (!groupUsers.includes(userId)) {
          //將新增的加入arr
          const newGroupUser = { uid: userId, email: editedGroupUserEmails[userId], role: group_type === '1' ? 2 : group_type === '2' ? 4 : 1 };
          console.log(newGroupUser);
          newGroupUsers.groupUsers.push(newGroupUser);
        }
      });

      //傳給後端
      const token = localStorage.getItem('accessToken');
      console.log('data for backend:', newGroupUsers);
      let result;
      if (location !== 'group_users') {
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
        <Modal.Title id="contained-modal-title-vcenter">{location === 'group_users' ? '你正在編輯' : `你正在新增${location}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h4>群組名稱</h4>
          <div id="group_name">
            <input ref={inputGroupName} type="text" defaultValue={currGroup ? currGroup.name : ''}></input>
          </div>
          <h4>成員們</h4>
          <div id="group_members">
            <ul>
              {editedGroupUserIds.length > 1 ? (
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
                <div>{`${name} ${email}`}</div>
              )}
            </ul>
            <div id="add_user">
              <h4>新增成員</h4>
              <input ref={inputUserEmail} id="add_user_email" type="email" placeholder="成員的信箱" />
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
