import { useContext } from 'react';
import { ListGroup, Row, Col, Card } from 'react-bootstrap';
import Icons from '../../../global/Icons';
import utils from '../../../global/utils';
import { GroupInfo } from './Home';

const Dashboard_list = ({ selfBalance }) => {
  //Context
  let CurrGroupInfo = useContext(GroupInfo);
  let { setCurrGroup } = CurrGroupInfo;

  return (
    <>
      <div className="dashboard-title">My Balance List</div>
      {selfBalance.summary && (
        <Row className="dashboard-self-summary-row">
          <Col className="dashboard-self-summary-col">
            <Card className="dashboard-self-summary-card owe-bg">
              <Card.Body className="dashboard-self-summary-card-body">
                <Card.Title className="dashboard-self-summary-card-title">Owe</Card.Title>
                <Card.Text className="dashboard-self-summary-card-amount-owe owe-font">{utils.currencyFormat(selfBalance.summary.borrow)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="dashboard-self-summary-col">
            <Card className="dashboard-self-summary-card total-bg">
              <Card.Body className="dashboard-self-summary-card-body">
                <Card.Title className="dashboard-self-summary-card-title">Net</Card.Title>
                <Card.Text className="dashboard-self-summary-card-amount-total total-font">{utils.currencyFormat(selfBalance.summary.net)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="dashboard-self-summary-col">
            <Card className="dashboard-self-summary-card owed-bg">
              <Card.Body className="dashboard-self-summary-card-body">
                <Card.Title className="dashboard-self-summary-card-title">Owed</Card.Title>
                <Card.Text className="dashboard-self-summary-card-amount-owed owed-font">{utils.currencyFormat(selfBalance.summary.lend)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {selfBalance.summary && (
        <div className="self-balance-list">
          <div key="self-balance-list-owe" className="self-balance-list-owe">
            <div className="self-balance-list-title">YOU OWE</div>
            {selfBalance.borrow.length ? (
              selfBalance.borrow.map((user) => {
                return (
                  <div key={user.uid} className="self-balance-owe-person-card">
                    <div key={`self-balance-owe-person-title-${user.uid}`} className="balance_total self-balance-owe-person-title">
                      <div>{user.user_name} </div>
                      <div>paid</div>
                      <div className="owe-font">{utils.currencyFormat(user.total)}</div>
                    </div>
                    <ListGroup key={`self-balance-owe-${user.uid}`}>
                      {user.pair ? <ListGroup.Item className="balance_pair self-balance-detail-item">Non-Group {utils.currencyFormat(user.pair)}</ListGroup.Item> : ''}
                      {user.group_normal.map((group) => {
                        return (
                          <ListGroup.Item
                            key={group.id}
                            className="balance-group-normal self-balance-detail-item"
                            onClick={() => setCurrGroup({ gid: group.gid, name: group.group_name, type: '1' })}
                          >
                            <div className="self-balance-detail-group-wrapper">
                              <div className="default-group-radius">
                                <Icons.GroupIcon className="default-group-picture" />
                              </div>
                              <div>{group.group_name}</div>
                            </div>
                            <div>{utils.currencyFormat(group.amount)}</div>
                          </ListGroup.Item>
                        );
                      })}
                      {user.group_buying.map((group) => {
                        return (
                          <ListGroup.Item key={group.id} className="balance_group_buying self-balance-detail-item">
                            <tbody className="self-balance-detail-table">
                              <tr>
                                <td>{group.group_name}</td>
                                <td>paid</td>
                                <td>{group.amount}</td>
                              </tr>
                            </tbody>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                );
              })
            ) : (
              <div className="self-balance-list-no-debt">Currently No Debt!</div>
            )}
          </div>
          <div key="self-balance-list-owed" className="self-balance-list-owed">
            <div className="self-balance-list-title">YOU ARE OWED</div>
            {selfBalance.lend.length ? (
              selfBalance.lend.map((user) => {
                return (
                  <div key={user.uid} className="self-balance-owed-person-card">
                    <div key={`self-balance-owed-person-title-${user.uid}`} className="balance_total self-balance-owed-person-title">
                      <div>{user.user_name} </div>
                      <div>owes you</div>
                      <div className="owed-font">{utils.currencyFormat(user.total)}</div>
                    </div>
                    <ListGroup key={`self-balance-owed-${user.uid}`}>
                      {user.pair ? <ListGroup.Item className="balance_pair self-balance-detail-item">Non-Group {utils.currencyFormat(user.pair)}</ListGroup.Item> : ''}
                      {user.group_normal.map((group) => {
                        return (
                          <ListGroup.Item
                            key={group.id}
                            className="balance-group-normal self-balance-detail-item"
                            onClick={() => setCurrGroup({ gid: group.gid, name: group.group_name, type: '1' })}
                          >
                            <div className="self-balance-detail-group-wrapper">
                              <div className="default-group-radius">
                                <Icons.GroupIcon className="default-group-picture" />
                              </div>
                              <div>{group.group_name}</div>
                            </div>
                            <div>{utils.currencyFormat(group.amount)}</div>
                          </ListGroup.Item>
                        );
                      })}
                      {user.group_buying.map((group) => {
                        return (
                          <ListGroup.Item key={group.id} className="balance_group_buying self-balance-detail-item">
                            <tbody className="self-balance-detail-table">
                              <tr>
                                <td>{group.group_name}</td>
                                <td>OWE YOU</td>
                                <td>{group.amount}</td>
                              </tr>
                            </tbody>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                );
              })
            ) : (
              <div className="self-balance-list-no-debt">Currently No Debt!</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard_list;
