import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../store/hooks";
import { signUp } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>();

  const onSubmit = async (data: SignUpInput) => {
    try {
      await dispatch(signUp(data)).unwrap();
      navigate("/");
    } catch (err) {}
  };

  return (
    <div className="mt-5">
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            id="fullName"
            {...register("name", { required: "Full name is required" })}
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Full Name"
          />
          <label htmlFor="fullName">Full Name</label>
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-floating mb-3">
          <input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
                message: "Invalid email address",
              },
            })}
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
          />
          <label htmlFor="email">Email</label>
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <div className="form-floating mb-3">
          <input
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
          />
          <label htmlFor="password">Password</label>
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
