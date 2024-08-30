import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EntrepreneurPortal from './pages/Entrepreneur/EntrepreneurPortal.jsx';
import InvestorPortal from './pages/Investor/InvestorPortal.jsx';
import StudentPortal from './pages/Student/StudentPortal.jsx';
import EntrepreneurProfile from './pages/Entrepreneur/EntrepreneurProfile.jsx';
import Startups from './pages/Entrepreneur/Startups.jsx';
import FindPartners from './pages/Entrepreneur/FindPartners.jsx';
import FindInvestors from './pages/Entrepreneur/FindInvestors.jsx';
import FindMentors from './pages/Entrepreneur/FindMentors.jsx';
import FindEmployees from './pages/Entrepreneur/FindEmployees.jsx';
import InvestorProfile from './pages/Investor/InvestorProfile.jsx';
import FindStartups from './pages/Investor/FindStartups.jsx';
import StudentProfile from './pages/Student/StudentProfile.jsx';
import FindJobs from './pages/Student/FindJobs.jsx';
import Login from "./pages/Login.jsx"
import Signup from './pages/Signup.jsx';
import AuthProvider from './auth/AuthProvider.jsx';
import Info from './pages/Info.jsx';
import Guide from './pages/Student/Guide.jsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import Jobs from './pages/Entrepreneur/Jobs.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/info/:role",
    element: <Info />,
  },
  {
    path: "/entrepreneur",
    element: <EntrepreneurPortal />,
    children: [
      {
        path: "/entrepreneur",
        element: <EntrepreneurProfile />,
      },
      {
        path: "/entrepreneur/profile",
        element: <EntrepreneurProfile />,
      },
      {
        path: "/entrepreneur/findEmployees",
        element: <FindEmployees />,
      },
      {
        path: "/entrepreneur/startups",
        element: <Startups />,
      },
      {
        path: "/entrepreneur/jobs",
        element: <Jobs />,
      },
      {
        path: "/entrepreneur/findPartners",
        element: <FindPartners />,
      },
      {
        path: "/entrepreneur/findInvestors",
        element: <FindInvestors />,
      },
      {
        path: "/entrepreneur/findMentors",
        element: <FindMentors />,
      },

    ],
  },
  {
    path: "/investor",
    element: <InvestorPortal />,
    children: [
      {
        path: "/investor",
        element: <InvestorProfile />,
      },
      {
        path: "/investor/profile",
        element: <InvestorProfile />,
      },
      {
        path: "/investor/findStartups",
        element: <FindStartups />,
      },
      {
        path: "/investor/jobs",
        element: <Jobs />,
      },
    ]
  },
  {
    path: "/student",
    element: <StudentPortal />,
    children: [
      {
        path: "/student",
        element: <StudentProfile />, 
      },
      {
        path: "/student/profile",
        element: <StudentProfile />, 
      },
      {
        path: "/student/findJobs",
        element: <FindJobs />, 
      },
      {
        path: "/student/guidence",
        element: <Guide/>
      }
    ]
  },
]);


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
