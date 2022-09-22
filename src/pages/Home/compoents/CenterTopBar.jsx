import Settle from './Settle';
import Add from './Add';
import EditGroup from './EditGroup';
import { useState, useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { GroupInfo } from './Home';

const CenterTopBar = ({ setGroupUsers, setGroupUserNames, setGroupUserEmails, setIsGroupChanged, setDebt, setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;
  const [editShow, setEditShow] = useState(false);

  return (
    <Navbar className="center-top-bar">
      <div id="group_name">{currGroup.gid ? currGroup.name : 'Dashboard'}</div>
      {currGroup.gid ? (
        <Navbar.Collapse className="justify-content-end">
          <div className="center-top-bar-button-warp">
            <EditGroup location="group_users" setGroupUsers={setGroupUsers} setGroupUserNames={setGroupUserNames} setGroupUserEmails={setGroupUserEmails} />
            <Add.AddButton setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
            <Settle.SettleButton key="settle-button" setIsDebtChanged={setIsDebtChanged} />
            <Button variant="outline-light" onClick={() => setEditShow(true)}>
              Group Setting
            </Button>
          </div>
          <div>
            <EditGroup
              location="group_users"
              editingShow={editShow}
              setEditingShow={setEditShow}
              setGroupUsers={setGroupUsers}
              setGroupUserNames={setGroupUserNames}
              setGroupUserEmails={setGroupUserEmails}
              setIsGroupChanged={setIsGroupChanged}
            />
          </div>
        </Navbar.Collapse>
      ) : (
        ''
      )}
    </Navbar>
  );
};

export default CenterTopBar;
