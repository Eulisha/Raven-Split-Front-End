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
  const CurrUser = useContext(User);

  const [currGroup, setCurrGroup] = useState({ gid: null, name: null, type: null });
  const [groupUsers, setGroupUsers] = useState([]); //array of Ids of groupUsers
  const [groupUserNames, setGroupUserNames] = useState({});
  const [groupUserEmails, setGroupUserEmails] = useState({});
  const [isGroupChanged, setIsGroupChanged] = useState(false);

  const [debts, setDebt] = useState([]);
  const [isDebtChanged, setIsDebtChanged] = useState(false);
  const [paging, setPaging] = useState(1);

  return (
    <GroupInfo.Provider
      value={{
        currGroup,
        groupUsers,
        groupUserNames,
        groupUserEmails,
        isGroupChanged,
        setIsGroupChanged,
        setCurrGroup,
        setGroupUsers,
        setGroupUserNames,
        setGroupUserEmails,
        paging,
        setPaging,
      }}
    >
      {CurrUser.user.id && (
        <>
          <UserGroups />
          <Container fluid id={currGroup.gid || null}>
            <div id="center_column">
              {currGroup.gid ? (
                <>
                  <CenterTopBar setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
                  <div className="group-debt-area">
                    <Debts debts={debts} setDebt={setDebt} isDebtChanged={isDebtChanged} setIsDebtChanged={setIsDebtChanged} />
                    <GroupUsers id="right_sidebar" isDebtChanged={isDebtChanged} setIsDebtChanged={setIsDebtChanged} />
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
