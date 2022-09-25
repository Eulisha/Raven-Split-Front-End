import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { GroupInfo } from './Home';
import Icons from '../../../global/Icons';
// import { NumericFormat } from 'react-number-format';

const DetailList = ({ details }) => {
  let CurrGroupInfo = useContext(GroupInfo);

  return (
    <>
      <ListGroup variant="flush" className="debt-detail-list">
        {Object.keys(details).map((borrowerId) => {
          return (
            <ListGroup.Item key={borrowerId} className="debt-detail-item">
              <div className="default-profile-radius">
                <Icons.UserIcon />
              </div>
              <div>{`${CurrGroupInfo.groupUserNames[borrowerId]}`}</div>
              <div>owns</div>
              <div>{`NT$ ${details[borrowerId]}`}</div>
              {/* <NumericFormat value={details[borrowerId]} thousandSeparator="," disabled style={{ border: 'none', backgroundColor: 'inherit' }} />; */}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};
export default DetailList;
