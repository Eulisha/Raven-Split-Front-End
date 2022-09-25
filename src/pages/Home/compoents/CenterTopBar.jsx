import Settle from './Settle';
import Add from './Add';
import EditGroup from './EditGroup';
import { useState, useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { GroupInfo } from './Home';

const CenterTopBar = ({ setDebt, setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup, groupUsers } = CurrGroupInfo;
  const [editShow, setEditShow] = useState(false);

  return (
    <Navbar className="center-top-bar">
      {currGroup.gid && (
        <>
          <div id="group_name">{currGroup.name}</div>
          <Navbar.Collapse className="justify-content-end">
            <div className="center-top-bar-button-warp">
              <Add.AddButton setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
              <Settle.SettleButton key="settle-button" setIsDebtChanged={setIsDebtChanged} />
              <Button size="sm" variant="outline-light" onClick={() => setEditShow(true)}>
                Group Setting
              </Button>
            </div>
            {groupUsers && editShow && (
              <div>
                <EditGroup editingShow={editShow} setEditingShow={setEditShow} />
              </div>
            )}
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
};

export default CenterTopBar;
