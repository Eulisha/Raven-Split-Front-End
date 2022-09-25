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
              <Card.Text className="dashboard-self-summary-card-amount-own">{`NT$ ${selfBalance.summary.borrow}`}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="dashboard-self-summary-col">
          <Card className="dashboard-self-summary-card total-bg">
            <Card.Body className="dashboard-self-summary-card-body">
              <Card.Title className="dashboard-self-summary-card-title">Net</Card.Title>
              <Card.Text className="dashboard-self-summary-card-amount-total">{`NT$ ${selfBalance.summary.net}`}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="dashboard-self-summary-col">
          <Card className="dashboard-self-summary-card owned-bg">
            <Card.Body className="dashboard-self-summary-card-body">
              <Card.Title className="dashboard-self-summary-card-title">Owned</Card.Title>
              <Card.Text className="dashboard-self-summary-card-amount-owned">{`NT$ ${selfBalance.summary.lend}`}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="self-balance-list">
        <div key="self-balance-list-own" className="self-balance-list-own">
          <div className="self-balance-list-title">YOU OWE</div>
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.borrow.map((user) => {
              return (
                <div key={user.uid} className="self-balance-own-person-card">
                  <div key={`self-balance-own-person-title-${user.uid}`} className="balance_total self-balance-own-person-title">
                    <div>{user.user_name} </div>
                    <div>paid</div>
                    <div className="own-font">$NT{user.total}</div>
                  </div>
                  <ListGroup key={`self-balance-own-${user.uid}`}>
                    {user.pair ? <ListGroup.Item className="balance_pair self-balance-detail-item">Non-Group $NT{user.pair}</ListGroup.Item> : ''}
                    {user.group_normal.map((group) => {
                      return (
                        <ListGroup.Item key={group.id} className="balance-group-normal self-balance-detail-item">
                          <div className="self-balance-detail-group-wrapper">
                            <div className="default-group-radius">
                              <Icons.GroupIcon className="default-group-picture" />
                            </div>
                            <div>{group.group_name}</div>
                          </div>
                          <div>{`$NT ${group.amount}`}</div>
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
            })}
        </div>
        <div key="self-balance-list-owned" className="self-balance-list-owned">
          <div className="self-balance-list-title">YOU ARE OWED</div>
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.lend.map((user) => {
              return (
                <div key={user.uid} className="self-balance-owned-person-card">
                  <div key={`self-balance-owned-person-title-${user.uid}`} className="balance_total self-balance-owned-person-title">
                    <div>{user.user_name} </div>
                    <div>owns you</div>
                    <div className="owned-font">$NT{user.total}</div>
                  </div>
                  <ListGroup key={`self-balance-owned-${user.uid}`}>
                    {user.pair ? <ListGroup.Item className="balance_pair self-balance-detail-item">Non-Group $NT{user.pair}</ListGroup.Item> : ''}
                    {user.group_normal.map((group) => {
                      return (
                        <ListGroup.Item key={group.id} className="balance-group-normal self-balance-detail-item">
                          <div className="self-balance-detail-group-wrapper">
                            <div className="default-group-radius">
                              <Icons.GroupIcon className="default-group-picture" />
                            </div>
                            <div>{group.group_name}</div>
                          </div>
                          <div>{`NT$ ${group.amount}`}</div>
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
