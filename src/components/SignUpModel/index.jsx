import { yupResolver } from "@hookform/resolvers/yup";
import { GENDER_OPTIONS, STYLE_MODEL } from "constants/globals";
import InputField from "custom-field/InputField";
import SelectField from "custom-field/SelectField";
import PropTypes from "prop-types";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button, Col, Form, Row, Spinner } from "reactstrap";
import * as yup from "yup";
import "./signup.scss";

SignUpModel.propTypes = {
  closeModel: PropTypes.func.isRequired,
  onCreateUser: PropTypes.func,
};

SignUpModel.defaultProps = {
  onCreateUser: null,
};

function SignUpModel(props) {
  const { closeModel, onCreateUser } = props;

  const { loading } = useSelector((state) => state.user);

  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
  };

  // yup schema

  const schema = yup.object().shape({
    firstname: yup.string().required("This field is require."),
    lastname: yup.string().required("This field is require."),
    email: yup
      .string()
      .matches(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please enter correct email!"
      )
      .required("This field is require."),
    password: yup
      .string()
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}?/,
        "Password must be at least 8 characters with one uppercase letter, one lowercase letter, and one special character"
      )
      .required("This field is require."),
    phone: yup
      .string()
      .required("this field is require.")
      .matches(/^0[0-9]{9}$/, "Please enter correct phone number!"),
    gender: yup.object().required("This field is require.").nullable(),
    address: yup.string().required("This field is require."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  // handle submit form

  const onSubmit = (data) => {
    if (!onCreateUser) return;
    onCreateUser({ ...data, gender: data.gender.value });
  };

  return (
    <div className="SignUpModel" style={STYLE_MODEL}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <header>Shoes Store🧦</header>
        <i onClick={() => closeModel()} className="bx bx-x" />
        <Row>
          <Col md={6}>
            <InputField
              name="firstname"
              control={control}
              label="First Name"
              errors={errors}
            />
          </Col>

          <Col md={6}>
            <InputField
              name="lastname"
              control={control}
              label="Last Name"
              errors={errors}
            />
          </Col>

          <Col md={6}>
            <InputField
              name="phone"
              control={control}
              label="Phone"
              errors={errors}
              type="number"
            />
          </Col>

          <Col md={6}>
            <SelectField
              name="gender"
              className="me-2"
              control={control}
              label="Gender"
              errors={errors}
              options={GENDER_OPTIONS}
            />
          </Col>

          <Col md={12}>
            <InputField
              name="email"
              control={control}
              label="Email"
              errors={errors}
              type="email"
            />
          </Col>

          <Col md={12}>
            <InputField
              name="password"
              control={control}
              label="Password"
              errors={errors}
              type="password"
            />
          </Col>
          <Col md={12}>
            <InputField
              name="address"
              control={control}
              label="Address"
              errors={errors}
            />
          </Col>
        </Row>

        <Button className="d-block w-100" disabled={loading}>
          Sign Up
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
      </Form>
    </div>
  );
}

export default SignUpModel;
