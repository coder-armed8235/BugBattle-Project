import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Flame, Target, CalendarDays } from 'lucide-react';

// Layout Constants
const CELL_SIZE = 12;
const CELL_GAP = 7;
const MONTH_GAP = 12;
const DAYS_IN_WEEK = 7;
const GRID_X_OFFSET = 10;
const GRID_Y_OFFSET = 24;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Heatmap({ data, year, onDayClick, onYearChange, availableYears }) {
  // State for interactive tooltip
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map incoming data to a fast lookup dictionary
  const dataMap = useMemo(() => new Map(data.map((d) => [d.date, d.count])), [data]);

  // Generate complete grid structure
  const { gridDays, monthMarkers, totalCols } = useMemo(() => {
    const gridDays = [];
    const monthMarkers = [];

    let currentTotalCols = 0;

    for (let m = 0; m < 12; m++) {
      const firstDate = new Date(year, m, 1);
      const firstDayOfWeek = firstDate.getDay();
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      
      const colsInMonth = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
      
      monthMarkers.push({ text: MONTH_LABELS[m], col: currentTotalCols, monthIndex: m });
      
      for (let d = 0; d < daysInMonth; d++) {
        const date = new Date(year, m, d + 1);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        const count = dataMap.get(dateString) || 0;
        
        const dayOfWeek = (firstDayOfWeek + d) % 7;
        const colIndex = Math.floor((firstDayOfWeek + d) / 7);
        
        gridDays.push({
          col: currentTotalCols + colIndex,
          y: dayOfWeek,
          monthIndex: m,
          date: dateString,
          count,
        });
      }
      
      currentTotalCols += colsInMonth;
    }

    return { gridDays, monthMarkers, totalCols: currentTotalCols };
  }, [year, dataMap]);

  // Statistics Calculation
  const stats = useMemo(() => {
    let total = 0;
    let max = 0;
    let maxStreak = 0;
    let currentStreakCounter = 0;
    let activeDays = 0;

    for (let i = 0; i < gridDays.length; i++) {
      const day = gridDays[i];
      if (!day) continue;

      total += day.count;
      if (day.count > max) max = day.count;

      if (day.count > 0) {
        activeDays++;
        currentStreakCounter++;
        if (currentStreakCounter > maxStreak) {
          maxStreak = currentStreakCounter;
        }
      } else {
        currentStreakCounter = 0;
      }
    }

    return { total, max, maxStreak, currentStreak: currentStreakCounter, activeDays };
  }, [gridDays]);

  // Helper functions
  const getColorScheme = (count) => {
    if (count === 0) return 'fill-[#333333]'; 
    if (count < 3) return 'fill-[#0e4429]';
    if (count < 6) return 'fill-[#006d32]';
    if (count < 10) return 'fill-[#26a641]';
    return 'fill-[#39d353]';
  };

  const svgWidth = GRID_X_OFFSET + totalCols * (CELL_SIZE + CELL_GAP) + 11 * MONTH_GAP + 10;
  const svgHeight = GRID_Y_OFFSET + DAYS_IN_WEEK * (CELL_SIZE + CELL_GAP) + 5;

  const handlePointerMove = (e) => {
    const target = e.target;
    if (target.tagName === 'rect' && target.dataset.date) {
      const rect = e.currentTarget.getBoundingClientRect();
      let x = e.clientX + 15;
      let y = e.clientY - 45;

      // Ensure tooltip doesn't overflow Window edges
      if (x + 180 > window.innerWidth) x = e.clientX - 190;
      if (y < 10) y = e.clientY + 20;

      setHoveredDay({
        date: target.dataset.date,
        count: parseInt(target.dataset.count || '0', 10),
      });
      setTooltipPos({ x, y });
    } else {
      setHoveredDay(null);
    }
  };

  const handlePointerLeave = () => setHoveredDay(null);

  const handleKeyDown = (e) => {
    // Optional: Add keyboard navigation
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full flex-col font-sans select-none">
      {/* Stats Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4 px-2">
        
        {/* Left Side Stats */}
        <div className="flex flex-col gap-2">
           <h3 className="text-neutral-200 text-[13px] font-medium">{stats.total} submissions in the past one year</h3>
           <div className="flex items-center gap-6 text-xs text-neutral-400">
             <span>Total active days: <span className="font-medium text-neutral-200">{stats.activeDays}</span></span>
             <span>Max streak: <span className="font-medium text-neutral-200">{stats.maxStreak}</span></span>
           </div>
        </div>

        {/* Year Switcher */}
        {availableYears && availableYears.length > 0 && onYearChange && (
          <div className="flex overflow-hidden rounded-md bg-[#333333]/50 p-1 shrink-0">
            {availableYears.map(y => (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  y === year 
                  ? 'bg-[#404040] text-emerald-400 whitespace-nowrap' 
                  : 'text-neutral-400 hover:text-neutral-200 whitespace-nowrap'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Heatmap Grid Container */}
      <div className="flex flex-col items-center">
        
        {/* SVG wrapper */}
        <div className="w-full max-w-212.5 overflow-hidden">
          <AnimatePresence mode="wait">
             <motion.svg
                key={year}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto drop-shadow-sm outline-none"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onKeyDown={handleKeyDown}
             >
                {/* Month Labels */}
                {monthMarkers.map((marker, i) => (
                   <text
                     key={`month-${i}`}
                     x={GRID_X_OFFSET + marker.col * (CELL_SIZE + CELL_GAP) + marker.monthIndex * MONTH_GAP}
                     y={GRID_Y_OFFSET - 8}
                     className="fill-neutral-400 text-[9px] font-medium tracking-wide"
                   >
                     {marker.text}
                   </text>
                ))}

                {/* The Cells */}
                {gridDays.map((day, idx) => {
                  if (!day) return null;

                  const px = GRID_X_OFFSET + day.col * (CELL_SIZE + CELL_GAP) + day.monthIndex * MONTH_GAP;
                  const py = GRID_Y_OFFSET + day.y * (CELL_SIZE + CELL_GAP);

                  return (
                     <rect
                       key={`day-rect-${day.date}`}
                       x={px}
                       y={py}
                       width={CELL_SIZE}
                       height={CELL_SIZE}
                       rx={2.5}
                       ry={2.5}
                       data-date={day.date}
                       data-count={day.count}
                       onClick={() => onDayClick?.(day.date, day.count)}
                       className={`
                          ${getColorScheme(day.count)} 
                          cursor-pointer 
                          transition-all duration-200 ease-in-out
                          hover:stroke-neutral-300 hover:stroke-[1.5px]
                       `}
                     />
                  );
                })}
             </motion.svg>
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-between w-full max-w-212.5 text-[11px] text-neutral-400 px-2 lg:px-4">
          <span className="cursor-pointer hover:text-emerald-400 transition-colors">Learn how we count</span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
               {[0, 2, 5, 8, 15].map((val, i) => (
                  <div 
                     key={i} 
                     className={`w-3 h-3 rounded-sm ${getColorScheme(val).replace('fill-', 'bg-')}`} 
                  />
               ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
         {hoveredDay && (
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ 
                 opacity: 1, 
                 scale: 1,
                 x: tooltipPos.x,
                 y: tooltipPos.y, 
               }}
               exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
               transition={{ type: 'spring', damping: 25, stiffness: 450, mass: 0.5 }}
               className="fixed top-0 left-0 z-50 pointer-events-none"
            >
               <div className="bg-neutral-800 text-neutral-100 text-sm py-2 px-3 rounded-lg shadow-2xl border border-neutral-700/50 flex flex-col gap-1 min-w-42.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between tabular-nums">
                     <span className="font-semibold text-emerald-400">
                        {hoveredDay.count} submissions
                     </span>
                  </div>
                  <div className="text-neutral-400 text-xs font-medium">
                     {formatDisplayDate(hoveredDay.date)}
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}