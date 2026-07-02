import React,{useState} from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { formatDistanceToNow } from 'date-fns';

export default function RecentActivity() {
  const [recentSubmissions, setRecentSubmissions] = useState([]);

const activities = recentSubmissions.map((item) => ({
  title: item.title,
  time: formatDistanceToNow(
    new Date(item.createdAt),
    { addSuffix: true }
  ),
  status: item.status,
  icon:
    item.status === "accepted"
      ? CheckCircle2
      : item.status === "wrong"
      ? XCircle
      : Clock,

  color:
    item.status === "accepted"
      ? "text-emerald-400"
      : item.status === "wrong"
      ? "text-red-400"
      : "text-yellow-400"
}));

  
useEffect(() => {

  async function fetchDetail() {
    try {
      const response = await axiosClient.get(
        '/problem/recently/solved'
      );
      setRecentSubmissions(response.data.formattedProblems);
    } catch (error) {
      console.log(error);
    }
  }
  fetchDetail();

}, []);


  return (
    <div className="bg-[#282828] rounded-xl p-5 shadow-sm text-neutral-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-neutral-400 font-medium text-xs uppercase tracking-wider">Recent Submissions</span>
      </div>
      <div className="flex flex-col">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center justify-between py-3.5 border-b border-[#3e3e3e]/50 last:border-0 hover:bg-[#333333] px-3 -mx-3 rounded-lg transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                 <act.icon className={act.color} size={16} />
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-neutral-200 group-hover:text-emerald-400 transition-colors leading-tight">{act.title}</h4>
                <span className="text-[11px] text-neutral-500 font-medium">{act.time}</span>
              </div>
            </div>
            <div className="hidden sm:block text-[11px] font-semibold px-2 py-1 bg-[#1a1a1a] rounded-md">
              <span className={act.color}>{act.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
