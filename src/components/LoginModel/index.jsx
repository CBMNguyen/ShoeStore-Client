import { yupResolver } from "@hookform/resolvers/yup";
import { STYLE_MODEL } from "constants/globals";
import InputField from "custom-field/InputField";
import PropTypes from "prop-types";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button, Form, Spinner } from "reactstrap";
import * as yup from "yup";
import "./login.scss";

LoginModel.propTypes = {
  showModel: PropTypes.func.isRequired,
  closeModel: PropTypes.func.isRequired,
  onLogin: PropTypes.func,
};

function LoginModel(props) {
  const { showModel, closeModel, onLogin } = props;
  const { loading } = useSelector((state) => state.user);

  const defaultValues = {
    email: "",
    password: "",
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("This field is require.")
      .matches(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please enter correct email!"
      ),
    password: yup.string().required("This field is require."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    if (!onLogin) return;
    onLogin(data);
  };
  return (
    <div className="LoginModel" style={STYLE_MODEL}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <header>Shoes Store🧦</header>
        <i onClick={() => closeModel()} className="bx bx-x" />
        <InputField
          name="email"
          control={control}
          label="Email"
          errors={errors}
          type="email"
        />
        <InputField
          name="password"
          control={control}
          label="Password"
          errors={errors}
          type="password"
        />
        <a href="/#">Forgot Password ?</a>
        <Button className="d-block w-100 m-auto mt-2 mb-2">
          Login
          {loading && (
            <Spinner
              size="sm"
              style={{ position: "absolute", top: "1rem", right: "1rem" }}
              color="light"
            >
              {" "}
            </Spinner>
          )}
        </Button>
        <footer>
          Don't have account?{" "}
          <span
            onClick={() => {
              showModel();
              closeModel();
            }}
            style={{ fontSize: "0.85rem", color: "#0d6efd", cursor: "pointer" }}
          >
            Signup Now ...
          </span>
        </footer>
      </Form>
    </div>
  );
}

export default LoginModel;
