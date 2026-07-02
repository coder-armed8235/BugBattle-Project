import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";

// Zod schema (slightly improved messages)
const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [signupMessage, setSignupMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isAuthenticated) {
      setSignupMessage({ type: "success", text: "Account created! Redirecting..." });
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error && !isAuthenticated) {
      setSignupMessage({ type: "error", text: error });
    }
  }, [error, isAuthenticated]);

  const onSubmit = async (data) => {
    setSignupMessage({ type: "", text: "" });
    try {
      await dispatch(registerUser(data)).unwrap();
      alert("Registration sucessfully");
    } catch (err) {
      // error handled via redux error state
    }
  };

  return (
    <div className="bg-[#1a1a1a] from-base-200 via-base-100 to-base-200 flex items-center justify-center p-13 overflow-hidden max-h-full">
      <div className="card w-110 max-w-lg bg-[#232327] shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden">
        <div className="card-body p-10 md:p-12">
          {/* Header */}
          <div className="text-center mb-3">
            <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join Us
            </h2>
            <p className="mt-2 text-base-content/70">
              Create your account and get started
            </p>
          </div>

          {/* Message area */}
          {signupMessage.text && (
            <div
              className={`alert ${
                signupMessage.type === "success" ? "alert-success" : "alert-error"
              } shadow-lg mb-3 animate-fade-in`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("fullName")}
              />
              {errors.fullName && (
                <div className="label">
                  <span className="label-text-alt text-error font-medium">
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
                className={`input input-bordered  w-full focus:input-primary transition-all duration-200 ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />
              {errors.emailId && (
                <div className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.emailId.message}
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
                className={`input input-bordered  w-full focus:input-primary transition-all duration-200 ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <div className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.password.message}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-">
              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 ${
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

          {/* Footer link */}
          <div className="text-center mt-4">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="link link-primary font-semibold hover:text-primary-focus transition-colors"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;