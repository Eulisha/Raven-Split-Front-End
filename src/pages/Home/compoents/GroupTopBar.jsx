import Settle from './Settle';
import Add from './Add';
import { Navbar } from 'react-bootstrap';

const GroupTopBar = ({ currGroup, groupUsers, groupUserNames, setDebt, setIsDebtChanged }) => {
  return (
    // <div id="top_bar">
    <Navbar id="top_bar">
      {/* <Container> */}
      <Navbar.Brand id="group_name">{currGroup.name}</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Add.AddButton
          // currUserId={currUserId} //FIXME: currUser可能要用 use context傳
          gid={currGroup.gid}
          groupUsers={groupUsers}
          groupUserNames={groupUserNames}
          setDebt={setDebt}
          setIsDebtChanged={setIsDebtChanged}
        />
        <Settle.SettleButton key="settle-button" gid={currGroup.gid} groupUsers={groupUsers} groupUserNames={groupUserNames} setIsDebtChanged={setIsDebtChanged} />
      </Navbar.Collapse>
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
