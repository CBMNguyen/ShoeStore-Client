import { yupResolver } from "@hookform/resolvers/yup";
import { logOut } from "app/userSlice";
import { GENDER_OPTIONS, STYLE_MODEL } from "constants/globals";
import InputField from "custom-field/InputField";
import SelectField from "custom-field/SelectField";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  Col,
  Form,
  FormFeedback,
  Input,
  Row,
  Spinner,
  Tooltip,
} from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import * as yup from "yup";
import "./profile.scss";
import firebase from "firebase";

Profile.propTypes = {
  onSubmit: PropTypes.func,
  model: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

Profile.defaultProps = {
  onSubmit: null,
};

function Profile(props) {
  const { model, closeModel, onSubmit, loading } = props;
  const [readOnly, setReadOnly] = useState(true);

  // tooltip log out
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const dispatch = useDispatch();

  // default value

  const defaultValues = {
    firstname: model.data.firstname,
    lastname: model.data.lastname,
    email: model.data.email,
    phone: model.data.phone,
    password: "",
    gender: {
      label: capitalizeFirstLetter(model.data.gender),
      value: model.data.gender,
    },
    image: model.data.image,
    address: model.data.address,
  };

  // Schema Yup

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
    phone: yup
      .string()
      .matches(/^0[0-9]{9}$/, "Please enter correct phone number!")
      .required("this field is require."),
    password: yup
      .string()
      .matches(
        !readOnly ? /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}?/ : "",
        "Password must be at least 8 characters with one uppercase letter, one lowercase letter, and one special character"
      ),
    gender: yup.object().required("This field is require.").nullable(),
    image: yup.mixed().required("This file is required"),
    address: yup.string().required("This field is require."),
  });

  // UseForm control

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const onFormSubmit = async (data) => {
    if (!onSubmit) return;
    await onSubmit(data);
  };

  // handle log out

  const handleLogout = async () => {
    await firebase.auth().signOut();
    dispatch(logOut());
    closeModel();
  };

  return (
    <div style={STYLE_MODEL}>
      <Form className="Profile" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="Profile__header">
          {/* Input opacity  */}
          <div>
            <i className="bx bxs-camera-plus" />

            <Input
              className="mt-1"
              {...register("image")}
              type="file"
              onChange={(e) => setValue("image", e.target.files[0])}
              invalid={!!errors["image"]}
            />
            {errors["image"] && (
              <FormFeedback>{errors["image"]["message"]}</FormFeedback>
            )}

            <img
              className="shadow-sm"
              src={`${process.env.REACT_APP_API_URL}/${model.data.image}`}
              alt=""
            />
          </div>

          <div className="Profile__logout">
            <i
              onClick={handleLogout}
              className="bx bx-power-off"
              id="TooltipExample"
            />

            <Tooltip
              placement="bottom"
              isOpen={tooltipOpen}
              target="TooltipExample"
              toggle={toggle}
            >
              Log out.
            </Tooltip>
          </div>

          <div onClick={() => closeModel()} className="Profile__close">
            <i className="bx bx-x" />
          </div>
        </div>
        <Row>
          <Col md={6}>
            <InputField
              className="mb-2"
              name="firstname"
              control={control}
              label="First Name"
              errors={errors}
            />
          </Col>

          <Col md={6}>
            <InputField
              className="mb-2"
              name="lastname"
              control={control}
              label="Last Name"
              errors={errors}
            />
          </Col>

          <Col md={6}>
            <InputField
              className="mb-2"
              name="email"
              control={control}
              label="Email"
              errors={errors}
              type="email"
            />
          </Col>

          <Col md={6}>
            <InputField
              className="mb-2"
              name="phone"
              control={control}
              label="Phone"
              errors={errors}
            />
          </Col>

          {
            <Col md={6}>
              <div
                style={{
                  position: "relative",
                }}
              >
                <i
                  onClick={() => setReadOnly(!readOnly)} // handle password click
                  className="bx bx-pencil passwordEdit"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "70px",
                  }}
                />

                <InputField
                  readOnly={readOnly}
                  name="password"
                  control={control}
                  type="password"
                  label="Password"
                  errors={errors}
                />
              </div>
            </Col>
          }

          <Col md={6}>
            <SelectField
              name="gender"
              control={control}
              label="Gender"
              errors={errors}
              options={GENDER_OPTIONS}
            />
          </Col>

          <Col>
            <InputField
              name="address"
              control={control}
              label="Address"
              errors={errors}
            />
          </Col>
        </Row>

        <button className="Profile__btn mt-4" type="submit" disabled={loading}>
          {loading && (
            <Spinner
              color="light"
              size="md"
              style={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              {" "}
            </Spinner>
          )}
          {model.data ? "Update" : "Submit"}
        </button>
      </Form>
    </div>
  );
}

export default Profile;
