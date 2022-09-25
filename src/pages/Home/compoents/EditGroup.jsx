import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import { Modal, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import { MdDelete } from 'react-icons/md';
import { useEffect } from 'react';

const EditGroup = ({ setEditingShow, editingShow }) => {
  console.log('@Edit Group');

  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo);
  let { id, name, email } = CurrUser.user;
  let { currGroup, groupUsers, groupUserNames, groupUserEmails, setCurrGroup, setIsGroupChanged } = CurrGroupInfo;
  let group_type = currGroup.type;
  console.log('id, name, email, currGroup, groupUsers, group_type: ', id, name, email, currGroup, groupUsers, group_type);

  //設定state
  const [editedGroupUserIds, setEditedGroupUserIds] = useState(groupUsers);
  const [editedGroupUserEmails, setEditedGroupUserEmails] = useState(groupUserEmails);
  const [editedGroupUserNames, setEditedGroupUserNames] = useState(groupUserNames);

  //設定ref
  const inputGroupName = useRef();
  const inputUserEmail = useRef();

  //EventHandle
  const handleAddUser = () => {
    if (Object.values(editedGroupUserEmails).includes(inputUserEmail.current.value)) {
      inputUserEmail.current.value = '';
      return alert('Member already in list above .');
    }
    const token = localStorage.getItem('accessToken');
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${constants.API_GET_User_EXIST}?email=${inputUserEmail.current.value}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setEditedGroup:', data.data);

        //查使用者存在
        const insertId = data.data.id;
        const userNameFromDb = data.data.name;
        console.log(insertId, userNameFromDb);
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

  useEffect(() => {
    console.log('use effect log editedGroupUserEmails, editedGroupUserNames, editedGroupUserIds:', editedGroupUserEmails, editedGroupUserNames, editedGroupUserIds);
  }, [editedGroupUserIds]);

  //儲存DB
  const handleSubmit = async () => {
    try {
      //整理送後端格式
      const newGroupUsers = { group_name: inputGroupName.current.value, group_type, groupUsers: [] };
      //[{uid:1,email:a@a.com,role:2}]

      console.log(editedGroupUserIds);
      editedGroupUserIds.map((userId) => {
        console.log('editedGroupUserId', userId, groupUsers);
        if (!groupUsers.includes(userId)) {
          //將新增的加入arr
          const newGroupUser = { uid: userId, email: editedGroupUserEmails[userId], role: group_type === '1' ? 2 : group_type === '2' ? 4 : 1 };
          // console.log(newGroupUser);
          newGroupUsers.groupUsers.push(newGroupUser);
          // console.log(newGroupUsers);
        }
      });

      //傳給後端
      const token = localStorage.getItem('accessToken');
      console.log('FRONT for put group:', newGroupUsers);

      const { data } = await axios.put(`${constants.API_PUT_GROUP}/${currGroup.gid}`, newGroupUsers, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('BACKEND for set group..: ', data.data);

      setIsGroupChanged((prev) => !prev);
      setEditingShow(false);
      setCurrGroup({ ...currGroup, ['name']: inputGroupName.current.value });
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
        <Modal.Title id="contained-modal-title-vcenter">{'編輯群組'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group id="group_name">
            <Form.Label>群組名稱</Form.Label>
            <Form.Control ref={inputGroupName} type="text" defaultValue={currGroup.name} />
          </Form.Group>
          <Form.Group id="group_members">
            <Form.Label>成員們</Form.Label>
            {editedGroupUserIds.length > 1 ? (
              editedGroupUserIds.map((uid) => {
                return (
                  <ListGroup key={uid}>
                    {uid === id ? (
                      <ListGroup.Item>{`${name} ${email}`}</ListGroup.Item>
                    ) : !groupUsers.includes(uid) ? (
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
                    ) : (
                      <ListGroup.Item>{`${groupUserNames[uid]} ${groupUserEmails[uid]}`}</ListGroup.Item>
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

export default EditGroup;
