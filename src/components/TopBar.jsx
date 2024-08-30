import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { FiSettings } from "react-icons/fi";
import { BiEditAlt, BiLogOut } from "react-icons/bi";
import PropTypes from "prop-types";

const TopBar = ({ portal }) => {
  const { logOut, user, editing, setEditing } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logOut();
    navigate("/login");
  };
  const handleEdit = ()=>{
    console.log(editing)
    setEditing(true)
    console.log(editing)
    navigate(`/info/${portal}`)
  }

  return (
    <div className=" navbar bg-gradient-to-l from-[#ad5389] to-[#3c1053] w-full h-16 sticky top-0 z-50 ">
      <div className="flex-1">
        <a className="text-xl font-bold text-black md:pb-2">
          <img
            className="md:w-[200px] w-[120px] ml-14 lg:ml-0"
            src="../../public/logo/BizConnect.png"
            alt=""
          />
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <div className="flex gap-1 text-black justify-center items-center text-base">
              <p>Hi, {user?.email.split("@")[0]}</p>
              <span className="text-xl">
                <FiSettings />
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow text-black"
          >
            {/* redirect to profile for setting you can remove it */}
            <li>
                <button className="flex flex-row justify-center items-center gap-2" onClick={handleEdit}>
                  <BiEditAlt /> Edit Info
                </button>
            </li>
            <li>
              <button onClick={handleLogout}>
                <a
                  href="/login"
                  className="flex flex-row justify-center items-center gap-2"
                >
                  <BiLogOut /> Logout
                </a>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

TopBar.propTypes = {
  portal: PropTypes.string,
};
