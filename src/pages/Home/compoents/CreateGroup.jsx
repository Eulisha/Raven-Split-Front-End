import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import { Modal, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import constants from '../../../global/constants';
import { User } from '../../App';
import { GroupInfo } from './Home';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import validator from '../../../global/validator';

const CreateGroup = ({ setEditingShow, editingShow }) => {
  let CurrUser = useContext(User);
  let CurrGroupInfo = useContext(GroupInfo) || {};
  let { id, name, email } = CurrUser.user;
  let { setIsGroupChanged } = CurrGroupInfo;
  let group_type = 'group_normal';

  switch (group_type) {
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

  const [editedGroupUserIds, setEditedGroupUserIds] = useState(initialGroupUserId);
  const [editedGroupUserEmails, setEditedGroupUserEmails] = useState(initialGroupUserEmail);
  const [editedGroupUserNames, setEditedGroupUserNames] = useState(initialGroupUserName);

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
        text: 'Member already in list above.',
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

        //查使用者存在
        const insertId = data.data.id;
        const userNameFromDb = data.data.name;
        //新增id到array
        setEditedGroupUserIds([...editedGroupUserIds, insertId]);
        setEditedGroupUserNames({ ...editedGroupUserNames, [insertId]: userNameFromDb });
        setEditedGroupUserEmails({ ...editedGroupUserEmails, [insertId]: inputUserEmail.current.value });
        inputUserEmail.current.value = '';
      } catch (err) {
        if (!err.response.data) {
          //系統錯誤
          Swal.fire({
            title: 'Oops!',
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
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          //系統錯誤
          Swal.fire({
            title: 'Oops!',
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
    e.target.disabled = true;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;

    const form = formRef.current;

    //前端驗證失敗
    if (!form.reportValidity()) {
      validator(formRef);
      e.target.disabled = false;
      return;
    }

    //沒有新增成員
    if (editedGroupUserIds.length < 2) {
      Swal.fire({
        title: 'Error!',
        text: 'A group should at least have two members.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      e.target.disabled = false;
      return;
    }

    //整理送後端格式
    const newGroupUsers = { group_name: inputGroupName.current.value, group_type, groupUsers: [] };
    //加自己
    newGroupUsers.groupUsers.push({ uid: id, email });
    //加其他人
    editedGroupUserIds.map((userId) => {
      if (userId != id) {
        const newGroupUser = { uid: userId, email: editedGroupUserEmails[userId] };
        newGroupUsers.groupUsers.push(newGroupUser);
      }
    });

    //傳給後端
    const token = localStorage.getItem('accessToken');
    Swal.fire({
      title: 'Saving...',
      showConfirmButton: false,
      allowOutsideClick: () => !Swal.isLoading(),
      didOpen: async () => {
        Swal.showLoading();
        try {
          await axios.post(`${constants.API_POST_GROUP}`, newGroupUsers, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          setTimeout(() => {
            setIsGroupChanged((prev) => !prev);
            setEditingShow(false);
            Swal.hideLoading();
            Swal.close();
            Swal.fire({ title: 'Created!', icon: 'success', showConfirmButton: false, timer: 1200 });
          }, 500);
        } catch (err) {
          if (!err.response.data) {
            //系統錯誤
            Swal.fire({
              title: 'Oops!',
              text: 'Network Connection failed, please try later...',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {
              setEditingShow(false);
            });
          } else if (err.response.data.provider) {
            //後端驗證失敗
            Swal.fire({
              title: 'Error!',
              text: err.response.data.err[0].msg,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            //系統錯誤
            Swal.fire({
              title: 'Oops!',
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
      },
    });
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
        <Modal.Title id="contained-modal-title-vcenter">Create Group</Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-group-body">
        <Form noValidate ref={formRef}>
          <Form.Group id="group_name">
            <Form.Label className="add-group-members-lebel">Group Name</Form.Label>
            <Form.Control required ref={inputGroupName} title="Group Name" type="text" placeholder="give me a name" />
          </Form.Group>
          <Form.Group className="add-group-members">
            <Form.Label className="add-group-members-lebel">You</Form.Label>
            <ListGroup>
              <ListGroup.Item>{`${name} ${email}`}</ListGroup.Item>
            </ListGroup>
            <Form.Label className="add-group-members-lebel-new">New Inviteing</Form.Label>
            {editedGroupUserIds.length > 1 &&
              editedGroupUserIds.map((uid, ind) => {
                if (ind !== 0) {
                  return (
                    <ListGroup key={uid}>
                      <ListGroup.Item>
                        {`${editedGroupUserNames[uid]} ${editedGroupUserEmails[uid]}`}
                        <MdDelete
                          id={uid}
                          className="add-group-members-delete-icon"
                          onClick={(event) => {
                            handleDeleteUser(event, uid);
                          }}
                        />
                      </ListGroup.Item>
                    </ListGroup>
                  );
                }
              })}
          </Form.Group>
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

export default CreateGroup;
