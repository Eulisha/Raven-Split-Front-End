const Dashboard_list = ({ selfBalance }) => {
  console.log('child:', selfBalance);
  return (
    <div id="self_balance_list">
      <div id="negatives">
        <ul>
          YOU OWE
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.borrow.map((user) => {
              return (
                <li key={user.uid}>
                  <div className="balance_total">
                    {user.uid} $NT{user.total}
                  </div>
                  <div>
                    <div className="balance_pair">{user.pair ? <div>Non-Group $NT{user.pair}</div> : ''}</div>
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
        </ul>
      </div>
      <div id="possitives">
        <ul>
          YOU ARE OWED
          {Object.keys(selfBalance).length > 0 &&
            selfBalance.lend.map((user) => {
              return (
                <li key={user.uid}>
                  <div className="balance_total">
                    {user.uid} $NT{user.total}
                  </div>
                  <div>
                    <div className="balance_pair">{user.pair ? <div>Non-Group $NT{user.pair}</div> : ''}</div>
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
        </ul>
      </div>
    </div>
  );
};
export default Dashboard_list;
