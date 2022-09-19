import { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

useEffect;
const DetailList = ({ details, groupUserNames }) => {
  return (
    <>
      <ListGroup>
        <div>length: {Object.keys(details).length}</div>
        {Object.keys(details).map((borrowerId) => {
          return (
            <ListGroup.Item key={borrowerId} className="item">
              {/* <div key={borrowerId} className="item"> */}
              {`${groupUserNames[borrowerId]} owns ${details[borrowerId]}`}
              {/* </div> */}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};
export default DetailList;
