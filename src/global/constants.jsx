const API_HOST = 'http://localhost:3000/api';

//Debt
const API_GET_DEBTS = `${API_HOST}/debt/debts`;
const API_GET_DEBT_DETAILS = `${API_HOST}/debt/detail`;
const API_GET_BALANCES = `${API_HOST}/debt/balances`;
const API_GET_SETTLE = `${API_HOST}/debt/settle`;
const API_GET_SELF_BALANCES = `${API_HOST}/debt/user-balances`;
const API_POST_DEBT = `${API_HOST}/debt/debt`;
const API_PUT_DEBT = `${API_HOST}/debt/debt`;
const API_DELETE_DEBT = `${API_HOST}/debt/debt`;
const API_POST_SETTLE = `${API_HOST}/debt/settle`;

//Group
const API_GET_GROUP_USERS = `${API_HOST}/group/group-users`;

//User
const API_POST_SIGNIN = `${API_HOST}/user/signin`;
const API_POST_SIGNUP = `${API_HOST}/user/signup`;
const API_GET_USER_GROUPS = `${API_HOST}/user/groups`;

export default {
  API_HOST,
  API_GET_GROUP_USERS,
  API_GET_DEBTS,
  API_GET_DEBT_DETAILS,
  API_GET_BALANCES,
  API_GET_SETTLE,
  API_GET_SELF_BALANCES,
  API_POST_DEBT,
  API_PUT_DEBT,
  API_DELETE_DEBT,
  API_POST_SIGNIN,
  API_POST_SIGNUP,
  API_GET_USER_GROUPS,
  API_POST_SETTLE,
};
