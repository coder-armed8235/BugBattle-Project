import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NavLink,useNavigate } from "react-router";
import axiosClient from '../utils/axiosClient'

// Zod schema (unchanged)
const passwordSchema = z
  .object({
    newpassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.newpassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

//type LoginFormData = z.infer<typeof loginSchema>;

function ChangePassword() {
    const [isSubmitting,setisSubmitting]=useState(0);
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
     try{
      const response= await axiosClient.post('/Auth/password/change',
        data,
       {
          withCredentials: true,
      });
     alert(response?.data?.message);
     navigate('/login');
     }catch(error){
      alert(error.message)
     }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] from-base-200 via-base-100 to-base-200 flex items-center justify-center p-6">
      <div className="card w-100 max-w-lg bg-[#232327] shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden">
        <div className="card-body p-10 md:p-12">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Forget Password
            </h2>
            <p className="mt-2 text-base-content/70">
              change password to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Current Password</span>
              </label>
              <input
                type="text"
                placeholder="New Password"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
                  errors.newpassword ? "input-error" : ""
                }`}
                {...register("newpassword")}
              />
              {errors.newpassword && (
                <div className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.newpassword.message}
                  </span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <div className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.confirmPassword.message}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                  isSubmitting ? "btn-disabled" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-md"></span>
                    changing password.
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="text-center mt-8">
            <p className="text-base-content/70">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="link link-primary font-semibold hover:text-primary-focus transition-colors"
              >
                Create account
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;