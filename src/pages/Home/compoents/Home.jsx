import '../index.css';
import { useState } from 'react';
import GroupUsers from './GroupUsers';
import UserGroups from './UserGroups';
import Debts from './Debts';
import GroupTopBar from './GroupTopBar';
import Dashboard from './Dashboard';

const Home = () => {
  const [currGroup, setCurrGroup] = useState({ gid: null, name: null });
  const [groupUsers, setGroupUsers] = useState([]); //array of Ids of groupUsers
  const [groupUserNames, setGroupUserNames] = useState({}); //{1:Euli}
  const [isDebtChanged, setIsDebtChanged] = useState(false);
  const [debts, setDebt] = useState([]);
  console.log('@home log currgroup', currGroup, 'gid', currGroup.gid, currGroup.name);
  return (
    <div id="Home">
      <div id="left_sidebar">
        <UserGroups setCurrGroup={setCurrGroup} />
      </div>
      <div id="center_column">
        <GroupTopBar currGroup={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
        {currGroup.gid ? (
          <Debts
            currGroup={currGroup}
            // currUserId={currUserId} //可以用jwt代替(?)
            groupUsers={groupUsers}
            groupUserNames={groupUserNames}
            debts={debts}
            setDebt={setDebt}
            isDebtChanged={isDebtChanged} //傳給debt跟detail
            setIsDebtChanged={setIsDebtChanged} //要傳給settle頁
          />
        ) : (
          <Dashboard />
        )}
      </div>
      <div id="right_sidebar">
        {currGroup.gid ? (
          <GroupUsers
            gid={currGroup.gid}
            currGroup={currGroup}
            groupUsers={groupUsers}
            groupUserNames={groupUserNames}
            setGroupUsers={setGroupUsers}
            setGroupUserNames={setGroupUserNames}
            isDebtChanged={isDebtChanged}
          />
        ) : (
          '尚未選取群組'
        )}
      </div>
    </div>
  );
};
export default Home;
