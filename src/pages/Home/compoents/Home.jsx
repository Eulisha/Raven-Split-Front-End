import '../index.css';
import React, { useState } from 'react';
import GroupUsers from './GroupUsers';
import UserGroups from './UserGroups';
import Debts from './Debts';
import CenterTopBar from './CenterTopBar';
import Dashboard from './Dashboard';
import { useContext } from 'react';
import { User } from '../../App';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { useEffect } from 'react';

export const GroupInfo = React.createContext();

const Home = () => {
  console.log('@Home');
  const CurrUser = useContext(User);
  console.log('user form context', CurrUser.user);

  const [currGroup, setCurrGroup] = useState({ gid: null, name: null, type: null });
  const [groupUsers, setGroupUsers] = useState([]); //array of Ids of groupUsers
  const [groupUserNames, setGroupUserNames] = useState({}); //{1:Euli}
  const [groupUserEmails, setGroupUserEmails] = useState({}); //{1:Euli}
  const [isDebtChanged, setIsDebtChanged] = useState(false);
  const [isGroupChanged, setIsGroupChanged] = useState(false);

  // console.log('@home log currgroup', currGroup, 'gid', currGroup.gid, currGroup.name);

  useEffect(() => {
    console.log('**********currGroup', currGroup);
  }, [currGroup]);
  return (
    <GroupInfo.Provider
      value={{ currGroup, groupUsers, groupUserNames, groupUserEmails, setIsGroupChanged, setGroupUsers, setGroupUserNames, setGroupUserEmails, isDebtChanged, isGroupChanged }}
    >
      <UserGroups setCurrGroup={setCurrGroup} isGroupChanged={isGroupChanged} setIsGroupChanged={setIsGroupChanged} />
      <Container fluid>
        <div id="center_column">
          {currGroup.gid ? (
            <>
              <CenterTopBar
                currGroup={currGroup}
                groupUsers={groupUsers}
                groupUserNames={groupUserNames}
                setGroupUsers={setGroupUsers}
                setGroupUserNames={setGroupUserNames}
                setGroupUserEmails={setGroupUserEmails}
                setIsGroupChanged={setIsGroupChanged}
                setIsDebtChanged={setIsDebtChanged}
              />
              <div className="group-debt-area">
                <Debts
                  isDebtChanged={isDebtChanged} //傳給debt跟detail
                  setIsDebtChanged={setIsDebtChanged} //要傳給settle頁
                />
                <GroupUsers
                  id="right_sidebar"
                  setGroupUsers={setGroupUsers}
                  setGroupUserNames={setGroupUserNames}
                  setGroupUserEmails={setGroupUserEmails}
                  isDebtChanged={isDebtChanged}
                  isGroupChanged={isGroupChanged}
                />
              </div>
            </>
          ) : (
            <Dashboard />
          )}
        </div>
        {/* <div id="right_sidebar">
          {currGroup.gid ? (
            <GroupUsers
              setGroupUsers={setGroupUsers}
              setGroupUserNames={setGroupUserNames}
              setGroupUserEmails={setGroupUserEmails}
              isDebtChanged={isDebtChanged}
              isGroupChanged={isGroupChanged}
            />
          ) : (
            '尚未選取群組'
          )} 
        </div>*/}
      </Container>
    </GroupInfo.Provider>
  );
};
export default Home;
