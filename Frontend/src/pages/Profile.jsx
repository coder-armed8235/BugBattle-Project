import { useState, useEffect, useMemo } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import Heatmap from '../components/CalenderHeatmap';
import axiosClient from '../utils/axiosClient';
import StatsCard from '../components/StatsCard';
import BadgesCard from '../components/BadgesCard';
import EditProfileModal from '../components/EditProfile';
import RecentActivity from '../components/RecentActivity';
import { MapPin, Link as LinkIcon, Edit2, Github, Twitter, Eye, CheckCircle2, MessageSquare, Star } from 'lucide-react';

 export default function UserProfile() {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 2, currentYear - 1, currentYear];
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [mockData, setMockData] = useState([]);
  const [profile, setProfile] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(()=>{
    async function fetchDetail(){
        const response= await axiosClient.get(`/Auth/profile`);
        setProfile(response.data);
    }
    fetchDetail();
  },[])

    useEffect(() => {
    const generateMockData = (year) => {
      const data = [];
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const days = isLeapYear ? 366 : 365;

      let streakActive = false;

      for (let i = 0; i < days; i++) {
        // Build the date carefully avoiding UTC timezone jumps
        const date = new Date(year, 0, i + 1);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // Weekend modifier - slightly less active on weekends
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const baseChance = isWeekend ? 0.3 : 0.65;

        // Maintain continuous streaks to make the map look authentic
        let chance = baseChance;
        if (streakActive) chance += 0.2;

        if (Math.random() < chance) {
          streakActive = true;
          // Most days have normal counts, some have huge burst counts
          let count = Math.floor(Math.random() * 4) + 1;
          if (Math.random() > 0.85) count += Math.floor(Math.random() * 8) + 4;

          data.push({ date: dateStr, count });
        } else {
          // Break the streak
          if (Math.random() > 0.4) streakActive = false;
        }
      }
      return data;
    };

    setMockData(generateMockData(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
  const fetchData = async () => {
    const response = await axiosClient.get(`/problem/activity/${selectedYear}`);
    const actualData=response.data;
    setMockData(Array.isArray(actualData) ? actualData : [])
  };
  fetchData();
}, [selectedYear]);

  const handleDayClick = (date, count) => {
    console.log(`Clicked on ${date}: ${count} submissions`);
  };

  return (
   <div className="min-h-screen bg-[#1a1a1a] text-neutral-200 font-sans tracking-tight py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-5">
        
        {/* Profile Sidebar */}
        <aside className="w-full lg:w-70 shrink-0 flex flex-col gap-4">
          
          {/* Main Info Card */}
          <div className="bg-[#282828] shadow-sm rounded-xl p-5 flex flex-col gap-5 relative">
            <div className="flex flex-row lg:flex-col xl:flex-row items-center sm:items-start lg:items-center xl:items-start gap-4">
              <div className="h-20 w-20 lg:h-24 lg:w-24 overflow-hidden rounded-xl bg-[#333333] shrink-0 border border-[#3e3e3e]/30">
                <img src={profile?.avatarUrl} alt={profile?.fullName} className="h-full w-full object-cover" />
              </div>
              <div className="text-left lg:text-center xl:text-left w-full mt-1">
                <h1 className="text-xl font-semibold text-neutral-100">{profile.fullName}</h1>
                <p className="text-neutral-400 text-[13px] mb-2">{profile.username}</p>
                <div className="flex items-center justify-start lg:justify-center xl:justify-start gap-2 text-[13px]">
                   {/* <span className="text-neutral-400">Rank</span>
                   <span className="text-neutral-200 font-medium">{profile.rank}</span> */}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-2 bg-[#333333] hover:bg-[#3e3e3e] text-emerald-500 hover:text-emerald-400 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Edit Profile
            </button>

            <div className="flex flex-col gap-3">
              {profile.bio && (
                <p className="text-[13px] text-neutral-300 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-col gap-2 text-[13px] text-neutral-400 mt-2">
                {profile.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={15} className="shrink-0" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <LinkIcon size={15} className="shrink-0" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-emerald-400 transition-colors">
                      {profile?.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {profile.twitter && (
                  <div className="flex items-center gap-3">
                    <Twitter size={15} className="shrink-0" />
                    <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="truncate hover:text-emerald-400 transition-colors">
                      {profile.twitter}
                    </a>
                  </div>
                )}
                {profile.github && (
                  <div className="flex items-center gap-3">
                    <Github size={15} className="shrink-0" />
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="truncate hover:text-emerald-400 transition-colors">
                      {profile.github}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-[#282828] shadow-sm rounded-xl px-5 py-4 flex flex-col gap-3">
             <span className="text-neutral-400 font-medium text-[13px]">Community Stats</span>
             <div className="flex flex-col gap-3 mt-1">
               <div className="flex items-center gap-3 text-[13px]">
                 <Eye size={15} className="text-blue-400 shrink-0" />
                 <span className="text-neutral-400 flex-1">Views</span>
                 <span className="text-neutral-200 font-medium">{profile.views}</span>
               </div>
               <div className="flex items-center gap-3 text-[13px]">
                 <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                 <span className="text-neutral-400 flex-1">Solutions</span>
                 <span className="text-neutral-200 font-medium">{profile.solutions}</span>
               </div>
               <div className="flex items-center gap-3 text-[13px]">
                 <MessageSquare size={15} className="text-yellow-400 shrink-0" />
                 <span className="text-neutral-400 flex-1">Discuss</span>
                 <span className="text-neutral-200 font-medium">{profile.discuss}</span>
               </div>
               <div className="flex items-center gap-3 text-[13px]">
                 <Star size={15} className="text-orange-400 shrink-0" />
                 <span className="text-neutral-400 flex-1">Reputation</span>
                 <span className="text-neutral-200 font-medium">{profile.reputation}</span>
               </div>
             </div>
          </div>

          {/* Languages */}
          {/* <div className="bg-[#282828] shadow-sm rounded-xl px-5 py-4 flex flex-col gap-3">
             <span className="text-neutral-400 font-medium text-[13px]">Languages</span>
             <div className="flex flex-col gap-2 pt-1">
               <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-300 bg-[#333333] px-2 py-0.5 rounded-md">C++</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">145 problems</span>
                  </div>
               </div>
               <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-300 bg-[#333333] px-2 py-0.5 rounded-md">TypeScript</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">89 problems</span>
                  </div>
               </div>
               <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-300 bg-[#333333] px-2 py-0.5 rounded-md">Python</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">12 problems</span>
                  </div>
               </div>
             </div>
          </div> */}

        </aside>

        {/* Main Content (Heatmap, Stats, Activity) */}
        <main className="flex-1 flex flex-col gap-5 min-w-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <StatsCard userDetail={profile.solvedStats}/>
            <BadgesCard profile={profile} />
          </div>

          {/* The Target Component */}
          <div className="w-full overflow-hidden bg-[#282828] rounded-xl p-5 shadow-sm">
            <Heatmap 
              data={mockData} 
              year={selectedYear} 
              onYearChange={setSelectedYear}
              onDayClick={handleDayClick}
              availableYears={availableYears}
            />
          </div>

          <RecentActivity />

        </main>
        
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
       onSave={(updatedProfile) => {
        setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
  }));
}}
      />
    </div>
  );
}