// const HOST = 'https://raven-split.life';
// const API_HOST = 'https://raven-split.life/api';
// const HOST = 'http://18.180.19.123';
// const API_HOST = 'http://18.180.19.123/api';
const HOST = 'http://localhost:3001';
const API_HOST = 'http://localhost:3000/api';

//Debt
const API_GET_DEBTS = `${API_HOST}/debt/debts`;
const API_GET_DEBT_DETAILS = `${API_HOST}/debt/detail`;
const API_GET_BALANCES = `${API_HOST}/debt/balances`;
const API_GET_DEBT_PAGES = `${API_HOST}/debt/pages`;
const API_GET_SETTLE = `${API_HOST}/debt/settle`;
const API_GET_SELF_BALANCES = `${API_HOST}/debt/user-balances`;
const API_POST_DEBT = `${API_HOST}/debt/debt`;
const API_PUT_DEBT = `${API_HOST}/debt/debt`;
const API_DELETE_DEBT = `${API_HOST}/debt/debt`;
const API_POST_SETTLE = `${API_HOST}/debt/settle`;
const API_POST_SETTLE_PAIR = `${API_HOST}/debt/settle-pair`;
const API_POST_SETTLE_DONE = `${API_HOST}/debt/settle-done`;

//Group
const API_GET_GROUP_USERS = `${API_HOST}/group/users`;
const API_POST_GROUP = `${API_HOST}/group/group`;
const API_PUT_GROUP = `${API_HOST}/group/group`;

//User
const API_POST_SIGNIN = `${API_HOST}/user/signin`;
const API_POST_SIGNUP = `${API_HOST}/user/signup`;
const API_GET_USER_INFO = `${API_HOST}/user/user-info`;
const API_GET_USER_GROUPS = `${API_HOST}/user/groups`;
const API_GET_User_EXIST = `${API_HOST}/user/user-exist`;

//Mapping
// const SPLIT_METHOD = { 1: 'even', 2: 'customize', 3: 'by share', 4: 'by percentage', 5: 'full_amount' };
const SPLIT_METHOD = { 1: 'even', 2: 'customize' };
const USER_ROLE = { 4: 'owner', 3: 'administer', 2: 'editor', 1: 'viewer' };
const GROUP_TYPE = { 1: 'group', 2: 'pair', 3: 'group_buying' };

export default {
  HOST,
  API_HOST,
  API_GET_GROUP_USERS,
  API_GET_DEBTS,
  API_GET_DEBT_DETAILS,
  API_GET_BALANCES,
  API_GET_DEBT_PAGES,
  API_GET_SETTLE,
  API_GET_SELF_BALANCES,
  API_POST_DEBT,
  API_PUT_DEBT,
  API_DELETE_DEBT,
  API_POST_SIGNIN,
  API_POST_SIGNUP,
  API_GET_USER_GROUPS,
  API_POST_SETTLE,
  API_POST_SETTLE_PAIR,
  API_POST_SETTLE_DONE,
  API_GET_USER_INFO,
  API_GET_User_EXIST,
  API_POST_GROUP,
  API_PUT_GROUP,
  SPLIT_METHOD,
  USER_ROLE,
  GROUP_TYPE,
};
