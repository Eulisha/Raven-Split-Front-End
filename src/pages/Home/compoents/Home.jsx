import '../index.css';
import React, { useState } from 'react';
import GroupUsers from './GroupUsers';
import UserGroups from './UserGroups';
import Debts from './Debts';
import GroupTopBar from './GroupTopBar';
import Dashboard from './Dashboard';
import { useContext } from 'react';
import { User } from '../../App';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
  const [debts, setDebt] = useState([]);
  // console.log('@home log currgroup', currGroup, 'gid', currGroup.gid, currGroup.name);

  return (
    <GroupInfo.Provider
      value={{ currGroup, groupUsers, groupUserNames, groupUserEmails, setIsGroupChanged, setGroupUsers, setGroupUserNames, setGroupUserEmails, isDebtChanged, isGroupChanged }}
    >
      {/* <div id="Home"> */}
      <Container fluid>
        <Row>
          <Col id="left_sidebar">
            <UserGroups setCurrGroup={setCurrGroup} isGroupChanged={isGroupChanged} setIsGroupChanged={setIsGroupChanged} />
          </Col>
          <Col xs={6} id="center_column">
            <GroupTopBar currGroup={currGroup} groupUsers={groupUsers} groupUserNames={groupUserNames} setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
            {currGroup.gid ? (
              <Debts
                debts={debts}
                setDebt={setDebt}
                isDebtChanged={isDebtChanged} //傳給debt跟detail
                setIsDebtChanged={setIsDebtChanged} //要傳給settle頁
              />
            ) : (
              <Dashboard />
            )}
          </Col>
          <Col id="right_sidebar">
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
          </Col>
        </Row>
      </Container>
      {/* </div> */}
    </GroupInfo.Provider>
  );
};
export default Home;
