import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginInput = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const onSubmit: SubmitHandler<LoginInput> = (data) => console.log(data);
  return (
    <>
      <div className="mt-5">
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
                  message: "Invalid email format",
                },
              })}
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="name@example.com"
            />
            <label htmlFor="email">Email</label>
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          <div className="form-floating mb-3">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Min length is 8",
                },
              })}
              id="password"
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="name@example.com"
            />
            <label htmlFor="password">Password</label>
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
