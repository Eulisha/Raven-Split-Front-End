import { ListGroup, Row, Col, Table, Card } from 'react-bootstrap';
const Dashboard_list = ({ selfBalance }) => {
  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>Total</Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>Own</Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>Owned</Card.Body>
          </Card>
        </Col>
      </Row>
      <Row id="self_balance_list">
        <Col className="flex-column">
          {/* <div id="negatives"> */}
          YOU OWE
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.borrow.map((user) => {
              return (
                <li key={user.uid}>
                  <div className="balance_total">
                    {user.user_name} $NT{user.total}
                  </div>
                  <div>
                    {user.pair ? <ListGroup.Item className="balance_pair">Non-Group $NT{user.pair}</ListGroup.Item> : ''}
                    <div className="balance_group_normal">
                      {user.group_normal.map((group) => {
                        return (
                          <div key={group.id}>
                            AT {group.group_name} <br />
                            YOU OWN {group.amount}
                          </div>
                        );
                      })}
                    </div>
                    <div className="balance_group_buying">
                      {user.group_buying.map((group) => {
                        return (
                          <div key={group.id}>
                            AT {group.group_name} <br />
                            YOU OWN {group.amount}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
          {/* </div> */}
        </Col>
        <Col className="flex-column">
          {/* <div id="possitives"> */}
          YOU ARE OWED
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.lend.map((user) => {
              return (
                <Card key={user.uid}>
                  <Card.Body className="balance_total">
                    {user.user_name} $NT{user.total}
                  </Card.Body>
                  <ListGroup>
                    {user.pair ? <ListGroup.Item className="balance_pair">Non-Group $NT{user.pair}</ListGroup.Item> : ''}
                    <ListGroup.Item className="balance_group_normal">
                      {user.group_normal.map((group) => {
                        return (
                          <Table key={group.id}>
                            <tbody>
                              <td>{group.group_name}</td>
                              <td>YOU OWN {group.amount}</td>
                            </tbody>
                          </Table>
                        );
                      })}
                    </ListGroup.Item>
                    {/* <div className="balance_group_buying"> */}
                    {user.group_buying.map((group) => {
                      return (
                        <div key={group.id}>
                          AT {group.group_name} <br />
                          YOU OWN {group.amount}
                        </div>
                      );
                    })}
                    {/* </div> */}
                  </ListGroup>
                </Card>
              );
            })}
        </Col>
      </Row>
    </>
    // {/* </div> */}
  );
};
export default Dashboard_list;
