import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";
import axiosClient from "../utils/axiosClient";
import { CircleArrowLeft} from 'lucide-react';

// Zod schema (slightly improved messages)
const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
   role: z.enum(["admin", "user"])
});

function AdminSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [signupMessage, setSignupMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setSignupMessage({ type: "", text: "" });
    try {
      const response= await axiosClient.post("/Auth/admin/register",{
        fullName:data.fullName,
        emailId:data.emailId,
        role:data.role,
        password:data.password
      });
      alert(response.data);
      setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 1500);
    } catch (err) {
      setSignupMessage({ type: "error", text: err.response?.data?.message });
    }
  };

return (
  <div className="min-h-screen bg-[#1a1a1a] from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
    <div className="card w-full max-w-md sm:max-w-md lg:max-w-md xl:max-w-88 bg-[#232327] shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden">
      <div className="card-body p-6 sm:p-8 lg:p-10 xl:p-12">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 lg:mb-4">
          <h2 className="text-3xl sm:text-3.5xl lg:text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Registration
          </h2>
          <p className="mt-2 text-base-content/70 text-sm sm:text-base">
            Create admin & user account and get started
          </p>
        </div>

        {/* Message area */}
        {signupMessage.text && (
          <div
            className={`alert ${
              signupMessage.type === "success" ? "alert-success" : "alert-error"
            } shadow-lg mb-5 sm:mb-6 animate-fade-in text-sm sm:text-base`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {signupMessage.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <span className="font-medium">{signupMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 sm:space-y-6">
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`input input-bordered w-full focus:input-primary transition-all duration-200 text-base ${
                errors.fullName ? "input-error" : ""
              }`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <div className="label">
                <span className="label-text-alt text-error font-medium text-xs sm:text-sm">
                  {errors.fullName.message}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className={`input input-bordered w-full focus:input-primary transition-all duration-200 text-base ${
                errors.emailId ? "input-error" : ""
              }`}
              {...register("emailId")}
            />
            {errors.emailId && (
              <div className="label">
                <span className="label-text-alt text-error font-medium text-xs sm:text-sm">
                  {errors.emailId.message}
                </span>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <select
              className={`select select-bordered w-full focus:select-primary transition-all duration-200 text-base ${
                errors.role ? "select-error" : ""
              }`}
              {...register("role")}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <div className="label">
                <span className="label-text-alt text-error font-medium text-xs sm:text-sm">
                  {errors.role.message}
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input input-bordered w-full focus:input-primary transition-all duration-200 text-base ${
                errors.password ? "input-error" : ""
              }`}
              {...register("password")}
            />
            {errors.password && (
              <div className="label">
                <span className="label-text-alt text-error font-medium text-xs sm:text-sm">
                  {errors.password.message}
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3 sm:pt-4 lg:pt-6">
            <button
              type="submit"
              className={`btn btn-primary btn-lg w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 text-base sm:text-lg ${
                isSubmitting || loading ? "btn-disabled" : ""
              }`}
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default AdminSignup;