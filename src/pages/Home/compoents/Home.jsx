import '../index.css';
import React, { useState } from 'react';
import GroupUsers from './GroupUsers';
import UserGroups from './UserGroups';
import Debts from './Debts';
import Dashboard from './Dashboard';
import { useContext } from 'react';
import { User } from '../../App';
import Container from 'react-bootstrap/Container';
import CenterTopBar from './CenterTopBar';

export const GroupInfo = React.createContext();

const Home = () => {
  console.log('@Home');
  const CurrUser = useContext(User);
  console.log('CurrUser: ', CurrUser);

  const [currGroup, setCurrGroup] = useState({ gid: null, name: null, type: null });
  const [groupUsers, setGroupUsers] = useState([]); //array of Ids of groupUsers
  const [groupUserNames, setGroupUserNames] = useState({}); //{1:Euli}
  const [groupUserEmails, setGroupUserEmails] = useState({}); //{1:Euli}
  const [isGroupChanged, setIsGroupChanged] = useState(false);

  const [debts, setDebt] = useState([]);
  const [isDebtChanged, setIsDebtChanged] = useState(false);

  return (
    <GroupInfo.Provider
      value={{ currGroup, groupUsers, groupUserNames, groupUserEmails, isGroupChanged, setIsGroupChanged, setCurrGroup, setGroupUsers, setGroupUserNames, setGroupUserEmails }}
    >
      {CurrUser.user && (
        <>
          <UserGroups setCurrGroup={setCurrGroup} isGroupChanged={isGroupChanged} setIsGroupChanged={setIsGroupChanged} />
          <Container fluid>
            <div id="center_column">
              {currGroup.gid ? (
                <>
                  <CenterTopBar setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
                  <div className="group-debt-area">
                    <Debts
                      debts={debts}
                      setDebt={setDebt}
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
                <Dashboard isGroupChanged={isGroupChanged} />
              )}
            </div>
          </Container>
        </>
      )}
    </GroupInfo.Provider>
  );
};
export default Home;
