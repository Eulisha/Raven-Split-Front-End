import Settle from './Settle';
import Add from './Add';
import { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import { GroupInfo } from './Home';

const GroupTopBar = ({ setDebt, setIsDebtChanged }) => {
  let CurrGroupInfo = useContext(GroupInfo);
  let { currGroup } = CurrGroupInfo;

  return (
    <Navbar id="top_bar">
      <Navbar.Brand id="group_name">Dashboard</Navbar.Brand>
      {currGroup.gid ? (
        <Navbar.Collapse className="justify-content-end">
          <Add.AddButton setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
          <Settle.SettleButton key="settle-button" setIsDebtChanged={setIsDebtChanged} />
        </Navbar.Collapse>
      ) : (
        ''
      )}
    </Navbar>
  );
};

export default GroupTopBar;
