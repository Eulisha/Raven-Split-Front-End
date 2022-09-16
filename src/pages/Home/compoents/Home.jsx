import { useState } from 'react';
import GroupUsers from './GroupUsers';
import UserGroups from './UserGroups';
import Debts from './Debts';

const Home = () => {
  const [currGroup, setCurrGroup] = useState({ gid: null, name: null });
  const [groupUsers, setGroupUsers] = useState([]); //array of Ids of groupUsers
  const [groupUserNames, setGroupUserNames] = useState({}); //{1:Euli}
  const [isSettle, setIsSettle] = useState(false);

  return (
    <div className="Home">
      <UserGroups setCurrGroup={setCurrGroup} />
      <div id="main">
        {currGroup.gid ? (
          <Debts
            id="debts"
            currGroup={currGroup.gid}
            // currUserId={currUserId} //可以用jwt代替(?)
            groupUsers={groupUsers}
            groupUserNames={groupUserNames}
            isSettle={isSettle} //傳給debt跟detail
            setIsSettle={setIsSettle} //要傳給settle頁
          />
        ) : (
          <p>I'm dashboard</p>
        )}
      </div>
      <div>
        {currGroup.gid ? (
          <GroupUsers
            gid={currGroup.gid}
            currGroup={currGroup}
            groupUsers={groupUsers}
            groupUserNames={groupUserNames}
            setGroupUsers={setGroupUsers}
            setGroupUserNames={setGroupUserNames}
            isSettle={isSettle}
          />
        ) : (
          '尚未選取群組'
        )}
      </div>
    </div>
  );
};
export default Home;
