import { Eye, EyeOff } from "lucide-react";
import {  useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { Link, useNavigate} from "react-router-dom";
import * as yup from "yup";

import useAuthStore from "../store/auth.store";
import { listed } from "@/constant/listed";
import Input from "@/components/ui/InputField";
import type { Register} from "@/types/auth";
import logo from "@/assets/logo-reliability.png";
import { BsGoogle } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {  isLoading , signup} = useAuthStore();
  // const handleSubmit = async (e: React.FormEvent) => {};

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>({
    defaultValues: { email: "", password: "" , name: ""},
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().required("email required"),
        password: yup.string().required("password required"),
        name: yup.string().required("Name Required"),
      })
    ),
  });

  const onSubmit = async (formData: Register) => {
   try {
     await signup(formData);
     navigate(listed.login)
   } catch (error) {
    console.log(error);
    
   }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      data-theme="dark"
    >
      <div className="absolute top-5 left-5">
        <Link to={"/"}>
        <p className="flex items-center gap-3">
          <FaArrowLeft /> Back
        </p>
        </Link>
      </div>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center space-y-4">
          <img src={logo} alt="logo" className="w-42" />
        </div>

        {/* Login Form */}
        <div className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 rounded-2xl shadow-xl p-8 relative">
          <div className="mb-6 text-center space-y-2">
            <span className="bg-gradient-to-r text-2xl font-bold from-cyan-500 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </span>
            <p className="text-white">Start monitoring your services today</p>
          </div>

          <button className="btn btn-secodary w-full">
            <BsGoogle /> Continue with Google
          </button>
          <div className="divider">OR</div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="">Full Name</label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={errors.password?.message}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 "
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/5 text-[#00E5FF] mt-1"
                required
              />
              <span className="ml-2 text-sm text-gray-400">
                I agree to the{" "}
                <Link to="#" className="text-[#00E5FF] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-[#00E5FF] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-3 btn"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="">
              {" Already have an account? "}
              <Link
                to="/signin"
                className="text-cyan-600 hover:text-cyan-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
