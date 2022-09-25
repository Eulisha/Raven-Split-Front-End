import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import { Modal, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import { MdDelete } from 'react-icons/md';

const CreateGroup = ({ location, setEditingShow, editingShow }) => {
  console.log('@Creat Group');

  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo) || {};
  let { id, name, email } = CurrUser.user;
  let { setIsGroupChanged } = CurrGroupInfo;
  let group_type;
  console.log('id, name, email: ', id, name, email);

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
  }

  //設定state
  const initialGroupUserId = [id];
  const initialGroupUserEmail = { id: email };
  const initialGroupUserName = { id: name };
  console.log('initial: ', initialGroupUserId, initialGroupUserEmail, initialGroupUserName);

  const [editedGroupUserIds, setEditedGroupUserIds] = useState(initialGroupUserId);
  const [editedGroupUserEmails, setEditedGroupUserEmails] = useState(initialGroupUserEmail);
  const [editedGroupUserNames, setEditedGroupUserNames] = useState(initialGroupUserName);

  //設定ref
  const inputGroupName = useRef();
  const inputUserEmail = useRef();

  //EventHandle
  const handleAddUser = () => {
    console.log(Object.values(editedGroupUserEmails), inputUserEmail.current.value);
    if (Object.values(editedGroupUserEmails).includes(inputUserEmail.current.value)) {
      inputUserEmail.current.value = '';
      return alert('Member already in list above.');
    }
    const token = localStorage.getItem('accessToken');
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${constants.API_GET_User_EXIST}?email=${inputUserEmail.current.value}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setEditedGroup: ', data.data);
        //查使用者存在
        const insertId = data.data.id;
        const userNameFromDb = data.data.name;
        //新增id到array
        setEditedGroupUserIds([...editedGroupUserIds, insertId]);
        setEditedGroupUserNames({ ...editedGroupUserNames, [insertId]: userNameFromDb });
        setEditedGroupUserEmails({ ...editedGroupUserEmails, [insertId]: inputUserEmail.current.value });
        inputUserEmail.current.value = '';
      } catch (err) {
        console.log(err.response.data.err);
        return alert(err.response.data.err);
      }
    };
    fetchUser();
  };

  const handleDeleteUser = (e, uid) => {
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

      //加自己
      newGroupUsers.groupUsers.push({ uid: id, email, role: '4' });
      // console.log('newGroupUsers', newGroupUsers);
      //加其他人
      editedGroupUserIds.map((userId) => {
        // console.log('editedGroupUserId:', userId);
        if (userId != id) {
          const newGroupUser = { uid: userId, email: editedGroupUserEmails[userId], role: group_type === 'group_normal' ? 2 : group_type === 'group_pair' ? 4 : 1 };
          newGroupUsers.groupUsers.push(newGroupUser);
          // console.log('newGroupUsers', newGroupUsers);
        }
      });

      //傳給後端
      const token = localStorage.getItem('accessToken');
      console.log('FRONT for post group:', newGroupUsers);

      const { data } = await axios.post(`${constants.API_POST_GROUP}`, newGroupUsers, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('BACKEND for set group..: ', data.data);

      setIsGroupChanged((prev) => !prev);
      // setEditedGroupUserIds([id]);
      // setEditedGroupUserEmails({ [id]: email });
      // setEditedGroupUserNames({ [id]: name });
      setEditingShow(false);
    } catch (err) {
      console.log(err.response.data.err);
      return alert(err.response.data.err);
    }
  };

  return (
    <Modal
      show={editingShow}
      onHide={() => {
        setEditingShow(false);
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{`你正在新增${location}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group id="group_name">
            <Form.Label>群組名稱</Form.Label>
            <Form.Control ref={inputGroupName} type="text" />
          </Form.Group>
          <Form.Group id="group_members">
            <Form.Label>成員們</Form.Label>
            {editedGroupUserIds.length > 1 ? (
              editedGroupUserIds.map((uid) => {
                return (
                  <ListGroup key={uid}>
                    {uid === id ? ( //如果是自己，就不給刪除鈕
                      <ListGroup.Item>{`${name} ${email}`}</ListGroup.Item>
                    ) : (
                      <div>
                        <ListGroup.Item>
                          {`${editedGroupUserNames[uid]} ${editedGroupUserEmails[uid]}`}
                          <MdDelete
                            id={uid}
                            onClick={(event) => {
                              handleDeleteUser(event, uid);
                            }} // 刪除icon
                          />
                        </ListGroup.Item>
                      </div>
                    )}
                  </ListGroup>
                );
              })
            ) : (
              <ListGroup>
                <ListGroup.Item>{`${name} ${email}`}</ListGroup.Item>
              </ListGroup>
            )}
          </Form.Group>
          <Form.Group>
            <div id="add_user">
              <Form.Label>受邀人的信箱</Form.Label>
              <InputGroup>
                <Form.Control ref={inputUserEmail} id="add_user_email" type="email"></Form.Control>
                <Button variant="outline-secondary" id="button-add" onClick={handleAddUser}>
                  Add
                </Button>
              </InputGroup>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroup;
