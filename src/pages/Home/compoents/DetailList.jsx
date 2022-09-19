import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { GroupInfo } from './Home';

const DetailList = ({ details }) => {
  let CurrGroupInfo = useContext(GroupInfo);

  return (
    <>
      <ListGroup>
        <div>length: {Object.keys(details).length}</div>
        {Object.keys(details).map((borrowerId) => {
          return (
            <ListGroup.Item key={borrowerId} className="item">
              {/* <div key={borrowerId} className="item"> */}
              {`${CurrGroupInfo.groupUserNames[borrowerId]} owns ${details[borrowerId]}`}
              {/* </div> */}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};
export default DetailList;
