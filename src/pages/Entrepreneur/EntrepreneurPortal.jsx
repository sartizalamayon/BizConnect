// pages/EntrepreneurPortal.js
import TopBar from '../../components/TopBar';
import Sidebar from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';

const EntrepreneurPortal = () => {
  return (
    <div>
      <TopBar portal="entrepreneur" />
    <div className="flex">
        <Sidebar portal="entrepreneur" />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
    </div >

  );
};

export default EntrepreneurPortal;