import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video,User,CircleArrowLeft} from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [hoveredId, setHoveredId] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      hoverColor: 'btn-success',
      bgColor: 'bg-success/10',
      hoverBg: 'bg-success/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      hoverColor: 'btn-warning',
      bgColor: 'bg-warning/10',
      hoverBg: 'bg-warning/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      hoverColor: 'btn-error',
      bgColor: 'bg-error/10',
      hoverBg: 'bg-error/20',
      route: '/admin/delete'
    },
    {
      id: 'upload',
      title: 'Video Management',
      description: 'Upload and delete tutorial/solution videos',
      icon: Video,
      color: 'btn-info',
      hoverColor: 'btn-info',
      bgColor: 'bg-info/10',
      hoverBg: 'bg-info/20',
      route: '/admin/video'
    },
     {
      id: 'register',
      title: 'Admin & User Registration',
      description: 'Add new Admin & User to the platform',
      icon: User,
      color: 'btn-info',
      hoverColor: 'btn-info',
      bgColor: 'bg-info/10',
      hoverBg: 'bg-info/20',
      route: '/admin/register'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-12 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
       
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-block mb-3">
            <span className="badge badge-lg badge-outline badge-primary font-semibold tracking-wider">
              ADMIN DASHBOARD
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content mb-3 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            Control Center
          </h1>
          <p className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto">
            Manage coding problems & video content with ease
          </p>
        </div>

        {/* Cards Grid - more compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 max-w-7xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            const isHovered = hoveredId === option.id;

            return (
              <NavLink
                key={option.id}
                to={option.route}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  group relative card bg-[#1a1a1f] shadow-lg 
                  transition-all duration-300 ease-out
                  hover:shadow-2xl hover:-translate-y-2
                  active:scale-[0.98]
                  overflow-hidden rounded-xl
                `}
              >
                {/* Hover gradient */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500
                    bg-linear-to-br ${option.hoverBg} to-transparent
                  `}
                />

                <div className="card-body items-center text-center p-6 relative z--1">
                  {/* Icon */}
                  <div
                    className={`
                      ${isHovered ? option.hoverBg : option.bgColor}
                      p-4 rounded-xl mb-4 
                      transition-all duration-400
                      group-hover:scale-110 group-hover:rotate-3
                      shadow-sm
                    `}
                  >
                    <IconComponent
                      size={36}
                      className={`
                        transition-colors duration-300
                        ${isHovered ? 'text-primary' : 'text-base-content/80'}
                        group-hover:text-primary
                      `}
                    />
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="text-base-content/70 mb-6 text-sm leading-relaxed min-h-11">
                    {option.description}
                  </p>

                  {/* Button */}
                  <div className="card-actions w-full">
                    <button
                      className={`
                        btn ${option.color} btn-md w-full
                        gap-2 shadow-md
                        group-hover:btn-active
                        transition-all duration-300
                        ${isHovered ? 'scale-105' : 'scale-100'}
                      `}
                    >
                      {option.title}
                      <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bottom glow line */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1 
                    bg-linear-to-r from-transparent via-primary/30 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  `}
                />
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;