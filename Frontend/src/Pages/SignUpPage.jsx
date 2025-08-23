import React, { useState } from "react";
import { ShipWheel as ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {

  const { signupMutation, isPending, error } = useSignUp();

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
 

  console.log("Signup Data:", signupData);

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}

        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          
          {error && (
              <div className="alert alert-error mb-4">
                 <span>{error.response?.data?.message || "Something went wrong!"}</span>
              </div>
          )}
          


          {/* {SIGNUP FORM } */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p className="text-sm opacity-70">
                  Please fill in the details below to create your account.
                </p>
              </div>
              <div className="space-y-4 mt-4">
                {/* Full Name input */}
                <div className="form-control w-full">
                  <label className="label mb-1" htmlFor="fullName">
                    <span className="label-text font-medium text-base">
                      Your Full Name
                    </span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="e.g. John Doe"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                {/* Email input */}
                <div className="form-control w-full">
                  <label className="label mb-1" htmlFor="email">
                    <span className="label-text font-medium text-base">
                      Email Address
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. john.doe@example.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
                {/* Password input */}
                <div className="form-control w-full">
                  <label className="label mb-1" htmlFor="password">
                    <span className="label-text font-medium text-base">
                      Create Password
                    </span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Choose a strong password"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* policy checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      required
                    />
                    <span className="text-xs leading-tight">
                      I agree to the{" "}
                      <span className="text-primary hover:underline">
                        terms of service
                      </span>{" "}
                      and{" "}
                      <span className="text-primary hover:underline">
                        privacy policy
                      </span>
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                 <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-2">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Log-in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE IMAGE */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default SignUpPage;
