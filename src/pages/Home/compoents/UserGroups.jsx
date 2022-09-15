import constants from '../../../global/constants';

const UserGroups = () => {
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const fetchuserGroups = async (uid) => {
      const { data } = await axios(`${constants.API_GET_USER_GROUPS}${uid}`);
      console.log('fetch data user-groups:  ', data);
      const groupUsers = [];
      const groupUserNames = [];
      let userNames = {};
      data.data.map((user) => {
        groupUsers.push(user.uid);
        userNames[user.uid] = user.name;
      });
      setUserGroups();
      setUserGroupNames();
    };
    fetchuserGroups(uid);
  }, []);
};
export default UserGroups;
