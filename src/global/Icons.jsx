import { CgProfile } from 'react-icons/cg';
import { GiRaven } from 'react-icons/gi';

const UserIcon = () => {
  return (
    <CgProfile className="default-profile-picture" />
    /* <GiRaven className="default-profile-picture" /> */
  );
};
const GroupIcon = () => {
  return (
    // <CgProfile className="default-profile-picture" />
    <GiRaven className="default-profile-picture" />
  );
};
export default { UserIcon, GroupIcon };
