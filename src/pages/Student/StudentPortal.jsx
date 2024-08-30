import TopBar from '../../components/TopBar';
import Sidebar from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';

const StudentPortal = () => {
  return (
    <div>
      <TopBar portal="student" />
    <div className="flex min-h-screen">
      <Sidebar portal="student" />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
    </div >
  );
};

export default StudentPortal;
