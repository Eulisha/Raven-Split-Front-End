import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
import utils from '../../../global/utils';

const DetailList = ({ details }) => {
  let CurrGroupInfo = useContext(GroupInfo);

  return (
    <>
      <ListGroup variant="flush" className="debt-detail-list">
        <ListGroup.Item className="debt-detail-list-title">Expense Details</ListGroup.Item>
        {Object.keys(details).map((borrowerId) => {
          return (
            <ListGroup.Item key={borrowerId} className="debt-detail-item">
              <div className="default-profile-radius">
                <Icons.UserIcon />
              </div>
              <div>{`${CurrGroupInfo.groupUserNames[borrowerId]}`}</div>
              <div>{utils.currencyFormat(details[borrowerId])}</div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};
export default DetailList;
