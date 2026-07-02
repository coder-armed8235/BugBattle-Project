import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/getAllProblem`);
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      if (!user) return;
      try {
        const { data } = await axiosClient.get('/problem/problemSolved');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    fetchSolvedProblems();
  }, [user]);


  // Filter logic
  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch = filters.status === 'all' ||
                       (filters.status === 'solved' && isSolved) ||
                       (filters.status === 'unsolved' && !isSolved);
    const searchMatch = problem.title.toLowerCase().includes(filters.search.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  // Statistics
  const totalProblems = problems.length;
  const solvedCount = solvedProblems.length;
  const progressPercentage = totalProblems ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Get unique tags from problems for filter dropdown
  const uniqueTags = [...new Set(problems.map(p => p.tags).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#1a1a1a] from-base-200 to-base-300">
  
      {/* Main Content */}
      <div className="container mx-auto p-2 md:p-6">
        {/* Hero Section */}
        <div className="hero bg-[#1a1a1a] p-2 mb-8 shadow-xl overflow-visible">
          <div className="hero-content flex-col lg:flex-row justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.fullName || 'Guest'}! 👋</h1>
              <p className="py-2 text-base-content/90">Continue your coding journey. You've solved {solvedCount} of {totalProblems} problems.</p>
            </div>
            <div className="w-full max-w-xs">
              <div className="stat bg-[#1a1a1a] rounded-box p-4">
                <div className="stat-title">Overall Progress</div>
                <div className="stat-value text-primary text-2xl">{progressPercentage}%</div>
                <progress className="progress progress-primary w-full" value={solvedCount} max={totalProblems}></progress>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-box p-4 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  className="grow" 
                  placeholder="Search problems..." 
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </label>
            </div>
            
            {/* Status Filter */}
            <select 
              className="select select-bordered w-full md:w-40"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

            {/* Difficulty Filter */}
            <select 
              className="select select-bordered w-full md:w-40"
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="all">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Tag Filter */}
            <select 
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="math">Math</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProblems.length === 0 ? (
              <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl p-8 text-center">
                <p className="text-lg">No problems match your filters.</p>
              </div>
            ) : (
              filteredProblems.map(problem => {
                const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                return (
                  <div 
                    key={problem._id} 
                     className="card bg-[#1a1a1a] backdrop-blur-sm shadow-xl border-b border-gray-400"
                  >
                    {/*border-base-300/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] */}
                    <div className="px-10 flex flex-row justify-between rounded-xl">
                      <div className="flex items-center flex-wrap gap-10">
                        <h2 className="card-title text-gray-50 ">
                          <NavLink to={`/problem/${problem._id}`} className="hover:text-primary transition-colors">
                            {problem.title}
                          </NavLink>
                        </h2>  
                      </div>
                       <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between gap-3 sm:gap-6 mt-2">
  
  {/* Left Section */}
  <div className="flex flex-wrap gap-2">
    
    <div
      className={`badge badge-outline ${getDifficultyBadgeColor(
        problem.difficulty
      )} gap-1 py-1 px-2 font-bold text-xs sm:text-sm`}
    >
      {problem.difficulty.charAt(0).toUpperCase() +
        problem.difficulty.slice(1)}
    </div>

    <div className="badge badge-outline gap-1 py-1 px-2 text-xs sm:text-sm">
      {problem.tags.charAt(0).toUpperCase() +
        problem.tags.slice(1)}
    </div>

  </div>

  {/* Right Section */}
  <div className="flex justify-start sm:justify-end">
    {isSolved ? (
      <div className="badge bg-green-600 gap-1 py-2 px-4 sm:py-3 sm:px-5 cursor-pointer font-bold text-xs sm:text-sm">
        <NavLink to={`/problem/${problem._id}`}>
          Solved
        </NavLink>
      </div>
    ) : (
      <div className="badge gap-1 py-2 px-4 sm:py-3 sm:px-6 text-white border-amber-50 cursor-pointer font-bold text-xs sm:text-sm">
        <NavLink
          to={`/problem/${problem._id}`}
          className="hover:text-primary transition-colors"
        >
          Solve
        </NavLink>
      </div>
    )}
  </div>

</div>
                    </div>
              </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'text-green-500';
    case 'medium': return 'text-yellow-300';
    case 'hard': return 'text-red-400';
    default: return 'badge-neutral';
  }
};

const getDifficultyIcon = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
    case 'medium':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'hard':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    default: return null;
  }
};

export default Homepage;