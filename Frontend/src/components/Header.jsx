import {useState} from 'react'
import { NavLink,useNavigate  } from 'react-router';
import { useDispatch,useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import {User,LockKeyhole,LogOut ,Code2} from "lucide-react";
function Header(){
     const { user,isAuthenticated } = useSelector((state) => state.auth);
     const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    //  const handleLogout = () => {
    //      dispatch(logoutUser());
    //     navigate("/login");
    //    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);
    
    return(
        <nav className="flex min-h-8 bg-[#1a1a1a]  shadow-lg px-4 p-2  top-0 z-10 max-w-full border-b border-gray-400">
        <div className="flex-1">
          <NavLink to="/home" className="btn btn-ghost text-xl font-bold gap-2">
          <Code2 className="w-8 h-8 bg-emerald-600 rounded-lg p-1" />
            BugBattle
          </NavLink>
        </div>

        {
          !isAuthenticated && (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-medium ring-2 ring-gray-200 '>
              <button
                onClick={() => navigate('/login')}
                className='cursor-pointer text-xs'
              >
                login
              </button>
            </div>
          )
        }

        {isAuthenticated && <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="group flex items-center gap-3 rounded-full p-1.5 transition hover:bg-gray-90  focus:outline-none cursor-pointer "
              aria-expanded={isDropdownOpen}
            >
              {/* Avatar */}
              {user?.avatarUrl? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-200 transition group-hover:ring-gray-300"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-medium ring-2 ring-gray-200">
                  {user?.fullName?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              {/* Name + Chevron (hidden on mobile) */}
              <div className="hidden items-center gap-1.5 md:flex">
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop click to close */}
                <div
                  className="fixed inset-0 z-40 md:hidden"
                  onClick={closeDropdown}
                />

                <div className="fixed right-1 top-13 z-9999 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-xl md:w-72">

                  {/* Menu Items */}
                  <div className="py-1">
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={closeDropdown}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </NavLink>
                  </div>

                 { user.role==='admin' && <NavLink
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={closeDropdown}
                    >
                      <LockKeyhole className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </NavLink>}

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={async() => {
                        try {
                            await dispatch(logoutUser());
                        } catch (error) {
                            
                        }
                        closeDropdown();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                   
                      <NavLink to={'/home'}>
                           <span>Log out</span>
                      </NavLink>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>}
        <hr />
      </nav>
    )
}

export default Header;