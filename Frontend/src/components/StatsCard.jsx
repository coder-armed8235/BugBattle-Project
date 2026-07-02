import React from 'react';
import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

export default function StatsCard({userDetail}) {

  const [difficulty,setDifficulty]=useState(null);
  const easy = userDetail?.easy || 0;
const medium = userDetail?.medium || 0;
const hard = userDetail?.hard || 0;

const total = easy + medium + hard;

const totalSolved = total;

const progress =
  total > 0 ? (totalSolved / total) * 100 : 0;

const strokeWidth = 5;
const radius = 38;

const circumference = 2 * Math.PI * radius;

const strokeDashoffset =
  circumference - (progress / 100) * circumference;
 useEffect(() => {
  async function fetchDetail() {
    try {
      const res = await axiosClient.get('/problem/difficulty');
      setDifficulty(res.data.data[0])
    } catch (err) {
      console.log(err);
    }
  }

  fetchDetail();
}, []);

  return (
    <div className="bg-[#282828] rounded-xl p-5 shadow-sm text-neutral-200 w-full h-full">
      <span className="text-neutral-400 font-medium text-[13px] mb-4 block">Solved Problems</span>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#404040" strokeWidth={strokeWidth} />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-neutral-100">{total}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1 w-full text-xs">
          <div className="w-full">
            <div className="flex justify-between mb-1.5">
              <span className="text-emerald-400 font-medium text-[13px]">Easy</span>
              <span className="text-neutral-300 font-semibold text-[13px]">{userDetail?.easy} <span className="text-neutral-500 font-normal">/ {difficulty?.easy}</span></span>
            </div>
            <div className="h-1.5 w-full bg-[#404040] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${(userDetail?.easy / difficulty?.easy) * 100}%` }} />
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-1.5">
              <span className="text-yellow-400 font-medium text-[13px]">Medium</span>
              <span className="text-neutral-300 font-semibold text-[13px]">{userDetail?.medium} <span className="text-neutral-500 font-normal">/ {difficulty?.medium}</span></span>
            </div>
            <div className="h-1.5 w-full bg-[#404040] rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-1000" style={{ width: `${(userDetail?.medium / difficulty?.medium) * 100}%` }} />
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-1.5">
              <span className="text-red-400 font-medium text-[13px]">Hard</span>
              <span className="text-neutral-300 font-semibold text-[13px]">{userDetail?.hard} <span className="text-neutral-500 font-normal">/ {difficulty?.hard}</span></span>
            </div>
            <div className="h-1.5 w-full bg-[#404040] rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full transition-all duration-1000" style={{ width: `${(userDetail?.hard / difficulty?.hard) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
