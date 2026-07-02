import { lazy,Suspense } from "react";
import {Routes, Route ,Navigate} from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import ForgetPassword from "./components/ForgetPassword";
import ChangePassword from "./components/NewPassword";

const Login=lazy(()=>import('./pages/Login'));
const Signup = lazy(()=>import( "./pages/Signup"));
const Homepage =lazy(()=>import( "./pages/Homepage"));

const AdminCreateProblem = lazy(()=>import("./components/AdminCreateProblem"));
const ProblemPage= lazy(()=>import('./pages/ProblemPage'));
const Admin = lazy(()=>import("./pages/Admin"));
const AdminDelete = lazy(()=>import( "./components/AdminDelete"));
const AdminUpload = lazy(()=>import( "./components/AdminUpload"));
const AdminVideo  = lazy(()=>import("./components/AdminVideo"));
const Layout = lazy(()=>import("./components/Layout"));
const UpdateProblemList = lazy(()=>import("./components/ProblemUpdate"));
const UpdateProblem = lazy(()=>import("./components/AdminUpdateProblem"));
const AdminSignup = lazy(()=>import( "./components/userAdminRegister"));
const UserProfile = lazy(()=>import("./pages/Profile"));
const FrontPage = lazy(()=>import('./pages/FrontPage'));


const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" />;
};

// Admin Route
const AdminRoute = ({ isAuthenticated, user }) => {
  return isAuthenticated && user?.role === "admin"
    ? <Outlet />
    : <Navigate to="/" />;
};

// Public Route
const PublicRoute = ({ isAuthenticated }) => {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/home" />;
};


function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
  <Suspense fallback={<div></div>}>
    <Routes>
      <Route path="/" element={<FrontPage></FrontPage>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/home" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/home" />:<Signup></Signup>}></Route>
      <Route path="/forgetPassword" element={<ForgetPassword/>}></Route>
      <Route path="/change/password" element={<ChangePassword/>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      <Route element={<Layout/>}>
        <Route path="/home" element={<Homepage/>}></Route>
        <Route path="/profile" element={isAuthenticated ?<UserProfile/>:<Navigate to="/login" />}></Route>
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/home" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminCreateProblem /> : <Navigate to="/home" />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <UpdateProblemList /> : <Navigate to="/home" />} />
        <Route path="/admin/update/problem/:problemId" element={isAuthenticated && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to="/home" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/home" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/home" />} />
        <Route path="/admin/register" element={isAuthenticated && user?.role === 'admin' ? <AdminSignup/> : <Navigate to="/home" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/home" />} />
       
      </Route>
       
    </Routes>
    </Suspense>
  </>
  )
}

export default App;