const API_HOST = 'http://localhost:3000';

//Debt
const API_GET_DEBTS = `${API_HOST}/api/debts?group=1`;
const API_GET_DEBT_DETAILS = `${API_HOST}/api/debt-detail/`;
const API_GET_BALANCES = `${API_HOST}/api/debts-balances/`;
const API_POST_DEBT = `${API_HOST}/api/debt/`;
const API_UPDATE_DEBT = `${API_HOST}/api/debt/`;
const API_DELETE_DEBT = `${API_HOST}/api/debt/`;

//Group
const API_GET_GROUP_USERS = `${API_HOST}/api/group-members/`;

//User
const API_POST_SIGNIN = `${API_HOST}/api/user/signin`;
const API_POST_SIGNUP = `${API_HOST}/api/user/signup`;
const API_GET_USER_GROUPS = `${API_HOST}/api/user/groups`;

export default {
  API_HOST,
  API_GET_GROUP_USERS,
  API_GET_DEBTS,
  API_GET_DEBT_DETAILS,
  API_GET_BALANCES,
  API_POST_DEBT,
  API_UPDATE_DEBT,
  API_DELETE_DEBT,
  API_POST_SIGNIN,
  API_POST_SIGNUP,
  API_GET_USER_GROUPS,
};
