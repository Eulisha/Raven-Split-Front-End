import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { GroupInfo } from './Home';

const DetailList = ({ details }) => {
  let CurrGroupInfo = useContext(GroupInfo);

  return (
    <>
      <ListGroup>
        {Object.keys(details).map((borrowerId) => {
          return (
            <ListGroup.Item key={borrowerId} className="item">
              {`${CurrGroupInfo.groupUserNames[borrowerId]} owns ${details[borrowerId]}`}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};
export default DetailList;
