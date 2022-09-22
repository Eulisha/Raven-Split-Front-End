import { ListGroup, Row, Col, Card } from 'react-bootstrap';
import Icons from '../../../global/Icons';

const Dashboard_list = ({ selfBalance }) => {
  return (
    <>
      <Row className="dashboard-self-summary-row">
        <Col className="dashboard-self-summary-col">
          <Card className="dashboard-self-summary-card own-bg">
            <Card.Body className="dashboard-self-summary-card-body">
              <Card.Title className="dashboard-self-summary-card-title">Own</Card.Title>
              <Card.Text className="dashboard-self-summary-card-amount-own">NT 3000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="dashboard-self-summary-col">
          <Card className="dashboard-self-summary-card total-bg">
            <Card.Body className="dashboard-self-summary-card-body">
              <Card.Title className="dashboard-self-summary-card-title">Total</Card.Title>
              <Card.Text className="dashboard-self-summary-card-amount-total">NT 10000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="dashboard-self-summary-col">
          <Card className="dashboard-self-summary-card owned-bg">
            <Card.Body className="dashboard-self-summary-card-body">
              <Card.Title className="dashboard-self-summary-card-title">Owned</Card.Title>
              <Card.Text className="dashboard-self-summary-card-amount-owned">NT 13000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="self-balance-list">
        <div className="self-balance-list-own">
          <div className="self-balance-list-title">YOU OWE</div>
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.borrow.map((user) => {
              return (
                <li key={user.uid}>
                  <div className="self-balance-owe-person-card">
                    {user.user_name} $NT{user.total}
                  </div>
                  <ListGroup>
                    {user.pair ? <ListGroup.Item className="balance_pair">Non-Group $NT{user.pair}</ListGroup.Item> : ''}
                    <div className="balance_group_normal">
                      {user.group_normal.map((group) => {
                        return (
                          <ListGroup.Item key={group.id}>
                            <div>AT {group.group_name}</div>
                            <div>YOU OWN {group.amount}</div>
                          </ListGroup.Item>
                        );
                      })}
                    </div>
                    <div className="balance_group_buying">
                      {user.group_buying.map((group) => {
                        return (
                          <div key={group.id}>
                            <div>AT {group.group_name}</div>
                            <div>YOU OWN {group.amount}</div>
                          </div>
                        );
                      })}
                    </div>
                  </ListGroup>
                </li>
              );
            })}
        </div>
        <div className="self-balance-list-owned">
          <div className="self-balance-list-title">YOU ARE OWED</div>
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.lend.map((user) => {
              return (
                <div key={user.uid} className="self-balance-owed-person-card">
                  <div className="balance_total self-balance-owed-person-title">
                    <div>{user.user_name} </div>
                    <div>own you</div>
                    <div>$NT{user.total}</div>
                  </div>
                  <ListGroup>
                    {user.pair ? <ListGroup.Item className="balance_pair self-balance-detail-item">Non-Group $NT{user.pair}</ListGroup.Item> : ''}
                    {/* <ListGroup.Item className="balance_group_normal self-balance-detail-list"> */}
                    {user.group_normal.map((group) => {
                      return (
                        <ListGroup.Item key={group.id} className="balance-group-normal self-balance-detail-item">
                          <div className="self-balance-detail-group-wrapper">
                            <div className="default-group-radius">
                              <Icons.GroupIcon className="default-group-picture" />
                            </div>
                            <div>{group.group_name}</div>
                          </div>
                          <div>{group.amount}</div>
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
            })}
        </div>
      </div>
    </>
  );
};
export default Dashboard_list;
