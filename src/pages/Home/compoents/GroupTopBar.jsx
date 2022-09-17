import Settle from './Settle';
import Add from './Add';
import { Navbar } from 'react-bootstrap';

const GroupTopBar = ({ currGroup, groupUsers, groupUserNames, setDebt, setIsDebtChanged }) => {
  console.log('at top bar log currgroup', currGroup);
  return (
    <Navbar id="top_bar">
      {/* <Container> */}
      <Navbar.Brand id="group_name">Dashboard</Navbar.Brand>
      {/* {currGroup.gid ? <Navbar.Brand id="group_name">{currGroup.name}</Navbar.Brand> : <Navbar.Brand id="group_name">Dashboard</Navbar.Brand>}
      {currGroup.gid ? <Navbar.Toggle /> : ''} */}
      {currGroup.gid ? (
        <Navbar.Collapse className="justify-content-end">
          <Add.AddButton gid={currGroup.gid} groupUsers={groupUsers} groupUserNames={groupUserNames} setDebt={setDebt} setIsDebtChanged={setIsDebtChanged} />
          <Settle.SettleButton key="settle-button" gid={currGroup.gid} groupUsers={groupUsers} groupUserNames={groupUserNames} setIsDebtChanged={setIsDebtChanged} />
        </Navbar.Collapse>
      ) : (
        ''
      )}
      {/* </Container> */}
    </Navbar>
  );
};

// function TextLinkExample() {
//   return (
//     <Navbar>
//       <Container>
//         <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
//         <Navbar.Toggle />
//         <Navbar.Collapse className="justify-content-end">
//           <Navbar.Text>
//             Signed in as: <a href="#login">Mark Otto</a>
//           </Navbar.Text>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

export default GroupTopBar;
