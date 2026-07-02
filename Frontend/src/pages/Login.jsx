import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authSlice";
import { NavLink,useNavigate } from "react-router";

// Zod schema (unchanged)
const loginSchema = z.object({
  emailId: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//type LoginFormData = z.infer<typeof loginSchema>;

function Login() {

  const navigate=useNavigate();
  const dispatch = useDispatch();

const {isAuthenticated,loading,error} = useSelector((state)=>state.auth);

  const [loginMessage, setLoginMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLoginMessage({ type: "success", text: "Login successful! Redirecting..." });
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error && !isAuthenticated) {
      setLoginMessage({ type: "error", text: error });
    }
  }, [error, isAuthenticated]);

  const onSubmit = async (data) => {
    setLoginMessage({ type: "", text: "" });
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (err) {
      // handled via redux error
    }
  };
  return (
    <div className="min-h-screen bg-[#1a1a1a] from-base-200 via-base-100 to-base-200 flex items-center justify-center p-6">
      <div className="card w-100 max-w-lg bg-[#232327] shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden">
        <div className="card-body p-10 md:p-12">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-base-content/70">
              Sign in to continue your journey
            </p>
          </div>

          {/* Message */}
          {loginMessage.text && (
            <div className={`alert ${loginMessage.type === "success" ? "alert-success" : "alert-error"} shadow-lg mb-3 animate-fade-in`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                {loginMessage.type === "success" ? (
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
              <span className="font-medium">{loginMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
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
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
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

            {/* Submit */}
            <div className="pt-4">
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
                    Signing in...
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
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="text-center mt-8">
            <p className="text-base-content/70">
              {" "}
              <NavLink
                to="/forgetPassword"
                className="link link-primary font-semibold hover:text-primary-focus transition-colors"
              >
                Forget Password?
              </NavLink>
            </p>
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

export default Login;