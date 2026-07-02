import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {NavLink,useNavigate} from 'react-router'
import axiosClient from "../utils/axiosClient";



export default function ForgetPassword(){
    const [step, setStep] = useState(1);
    const[isLoading,setisLoading]=useState(0);

    const navigate=useNavigate();
    const schema =
    step === 1
      ? z.object({
          emailId: z.string().email("Invalid Email"),
        })
      : z.object({
          emailId: z.string().email(),
          otp: z
            .string()
            .min(6, "OTP must be 6 digits")
            .max(6, "OTP must be 6 digits"),
    });
     const {
        register,
        handleSubmit,
         formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
      });

      const onSubmit=async(data)=>{
        try{
          if (step=== 1) {
            setisLoading(true);
            const response= await axiosClient.post('/Auth/forget/password', data);
            setisLoading(false);
            setStep(2);
      } else {
        setisLoading(true);
        const response= await axiosClient.post('/Auth/forget/password/verify', data);
        navigate('/change/password');
        setisLoading(false);
      }
            
        }catch(error){
          setisLoading(false);
        }
      }

      return(
       <div className="min-h-screen bg-[#1a1a1a] from-base-200 via-base-100 to-base-200 flex items-center justify-center p-6">
      <div className="card w-100 max-w-lg bg-[#232327] shadow-2xl border border-base-300/30 rounded-2xl overflow-hidden">
        <div className="card-body p-10 md:p-12">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Forget Password
            </h2>
            <p className="mt-2 text-base-content/70">
              
            </p>
          </div>

          {/* Message */}
          

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

            {step === 2 && (
              <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">OTP</span>
              </label>
              <input
                type="number"
                placeholder="name@example.com"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
                  errors.otp ? "input-error" : ""
                }`}
                {...register("otp")}
              />
              {errors.otp && (
                <div className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.otp.message}
                  </span>
                </div>
              )}
            </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                  isLoading ? "btn-disabled" : ""
                }`}
                disabled={isLoading}
              >
                 {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-md"></span>
                   otp generating
                  </>
                ):step === 1 ? "Send Reset Code" : "Next"}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="text-center mt-8">
            <p className="text-base-content/70">
              Remembered your password?{" "}
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
      )
}