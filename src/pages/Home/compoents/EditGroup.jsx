import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import { Modal, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import { MdDelete } from 'react-icons/md';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import validator from '../../../global/validator';

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
  const formRef = useRef();

  //EventHandle
  const handleAddUser = (e) => {
    e.target.disabled = true;
    if (inputUserEmail.current.value === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Please entry email.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      e.target.disabled = false;
      return;
    }
    if (Object.values(editedGroupUserEmails).includes(inputUserEmail.current.value)) {
      inputUserEmail.current.value = '';
      Swal.fire({
        title: 'Error!',
        text: 'Member already in list above .',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      e.target.disabled = false;
      return;
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
        e.target.disabled = false;
      } catch (err) {
        console.log(err.response);
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            setEditingShow(false);
          });
        } else if (err.response.status == 404) {
          //帳號不存在
          Swal.fire({
            title: 'Error!',
            text: 'User not exist.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (err.response.data.provider) {
          //後端驗失敗
          //從validator來的error是array形式
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          //系統錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            setEditingShow(false);
          });
        }
      } finally {
        e.target.disabled = false;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const form = formRef.current;
    if (form.reportValidity()) {
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
        console.log(err.response);
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            setEditingShow(false);
          });
        } else if (err.response.data.provider) {
          //從validator來的error是array形式
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          //系統錯誤
          Swal.fire({
            title: 'Error!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          setEditingShow(false);
          return;
        }
      } finally {
        e.target.disabled = false;
      }
    } else {
      validator(formRef);
      e.target.disabled = false;
      return;
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
        <Modal.Title id="contained-modal-title-vcenter">Edit Group</Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-group-body">
        <Form noValidate ref={formRef}>
          <Form.Group id="group_name">
            <Form.Label className="add-group-members-lebel">Group Name</Form.Label>
            <Form.Control required ref={inputGroupName} title="Group Name" type="text" placeholder="give me a name" defaultValue={currGroup.name} />
          </Form.Group>
          {editedGroupUserIds.length > 1 ? (
            <Form.Group className="add-group-members">
              <Form.Label className="add-group-members-lebel">Current Members</Form.Label>
              {editedGroupUserIds.map((uid) => {
                return (
                  groupUsers.includes(uid) && (
                    <ListGroup>
                      <ListGroup.Item>{`${groupUserNames[uid]} ${groupUserEmails[uid]}`}</ListGroup.Item>
                    </ListGroup>
                  )
                );
              })}
            </Form.Group>
          ) : (
            <Form.Group className="add-group-members">
              (
              <ListGroup>
                <ListGroup.Item>{`${name} ${email}`}</ListGroup.Item>
              </ListGroup>
              )
            </Form.Group>
          )}
          <Form.Label className="add-group-members-lebel-new">New Inviteing</Form.Label>
          {editedGroupUserIds.map((uid) => {
            return (
              !groupUsers.includes(uid) && (
                <ListGroup key={uid}>
                  <ListGroup.Item>
                    {`${editedGroupUserNames[uid]} ${editedGroupUserEmails[uid]}`}
                    <MdDelete
                      id={uid}
                      className="add-group-members-delete-icon"
                      onClick={(event) => {
                        handleDeleteUser(event, uid);
                      }} // 刪除icon
                    />
                  </ListGroup.Item>
                </ListGroup>
              )
            );
          })}
          <hr style={{ marginTop: '30px' }} />
          <Form.Group>
            <div className="add-group-invite-friend">
              <Form.Label className="add-group-members-lebel">Invite Friend To Join</Form.Label>
              <InputGroup className="add-group-invite-friend-input">
                <Form.Control ref={inputUserEmail} className="add-group-email" type="email" placeholder="enter email"></Form.Control>
                <Button variant="outline-success" className="add-group-members-btn" onClick={handleAddUser}>
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
