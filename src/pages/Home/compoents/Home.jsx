import { useState } from 'react';
import GroupUsers from './GroupUsers';
import UserGroups from './UserGroups';
import Debts from './Debts';

const Home = () => {
  const [currGroup, setCurrGroup] = useState({ gid: null, name: null });
  const [groupUsers, setGroupUsers] = useState([]); //array of Ids of groupUsers
  const [groupUserNames, setGroupUserNames] = useState({}); //{1:Euli}
  const [isDebtChanged, setIsDebtChanged] = useState(false);

  return (
    <div className="Home">
      <UserGroups id="left_sidebar" setCurrGroup={setCurrGroup} />
      <div id="center_column">
        {currGroup.gid ? (
          <Debts
            id="debts"
            currGroup={currGroup.gid}
            // currUserId={currUserId} //可以用jwt代替(?)
            groupUsers={groupUsers}
            groupUserNames={groupUserNames}
            isDebtChanged={isDebtChanged} //傳給debt跟detail
            setIsDebtChanged={setIsDebtChanged} //要傳給settle頁
          />
        ) : (
          <p>I'm dashboard</p>
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
