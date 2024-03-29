import { yupResolver } from "@hookform/resolvers/yup";
import { deleteAddress } from "app/addressSlice";
import { logOut } from "app/userSlice";
import AddressForm from "components/AddressForm";
import {
  GENDER_OPTIONS,
  PRODUCT_TOAST_OPTIONS,
  STYLE_MODEL,
} from "constants/globals";
import DateInputField from "custom-field/DateInputField";
import InputField from "custom-field/InputField";
import SelectField from "custom-field/SelectField";
import firebase from "firebase";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import brandLogo from "../../assets/images/brandLogo.png";

import {
  Alert,
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import * as yup from "yup";
import "./profile.scss";

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
  const [avatar, setAvatar] = useState();
  const [modal, setModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();

  const { addresses, loading: addressLoading } = useSelector(
    (state) => state.address
  );
  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.review);
    };
  }, [avatar]);

  const dispatch = useDispatch();
  const [showAddressForm, setShowAddressForm] = useState(false);
  // convert date from string to date value
  const birthdate = new Date(model.data.birthdate);

  // default value
  const defaultValues = {
    firstname: model.data.firstname,
    lastname: model.data.lastname,
    birthdate,
    email: model.data.email,
    phone: model.data.phone,
    password: "",
    gender: {
      label: capitalizeFirstLetter(model.data.gender),
      value: model.data.gender,
    },
    image: model.data.image,
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
    birthdate: yup.date().required("This field is require."),
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
    toast("Successfully logout.", {
      ...PRODUCT_TOAST_OPTIONS,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatar(file);
    setValue("image", file);
  };

  // Handle remove address

  const handleRemoveAddress = async () => {
    try {
      await dispatch(deleteAddress(selectedAddress._id));
      toast("Successfully deleted address.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      setModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="animation-fade-in" style={STYLE_MODEL}>
      <Form className="Profile" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="Profile__header">
          {/* Input opacity  */}
          <div>
            <i className="bx bxs-camera-plus" />

            <Input
              className="mt-1"
              {...register("image")}
              type="file"
              onChange={handleAvatarChange}
              invalid={!!errors["image"]}
              disabled={model?.data && !model?.data?.phone}
            />
            {errors["image"] && (
              <FormFeedback>{errors["image"]["message"]}</FormFeedback>
            )}

            {(model.data.image || avatar) && (
              <img
                className="shadow-sm img-fluid shadow"
                src={avatar ? avatar.preview : model.data.image}
                alt=""
              />
            )}

            {(!model?.data?.image || model?.data?.image === "null") && !avatar && (
              <div className="Profile__avatarText shadow">
                <code className="text-white">{model.data.firstname[0]}</code>
              </div>
            )}
          </div>

          <div className="Profile__logout">
            <i
              onClick={handleLogout}
              className="bx bx-power-off"
              id="TooltipExample"
            />
          </div>

          <div onClick={() => closeModel()} className="Profile__close">
            <i className="bx bx-x" />
          </div>
        </div>
        <Row>
          <Col xs={6} md={4}>
            <InputField
              className="mb-2"
              name="firstname"
              control={control}
              label="First Name"
              errors={errors}
              disabled={model?.data && !model?.data?.phone}
            />
          </Col>

          <Col xs={6} md={4}>
            <InputField
              className="mb-2"
              name="lastname"
              control={control}
              label="Last Name"
              errors={errors}
              disabled={model?.data && !model?.data?.phone}
            />
          </Col>

          <Col xs={6} md={4}>
            <SelectField
              name="gender"
              control={control}
              label="Gender"
              errors={errors}
              options={GENDER_OPTIONS}
              disabled={model?.data && !model?.data?.phone}
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
              disabled={model?.data && !model?.data?.phone}
            />
          </Col>

          <Col md={6}>
            <InputField
              className="mb-2"
              name="phone"
              control={control}
              label="Phone"
              errors={errors}
              disabled={model?.data && !model?.data?.phone}
            />
          </Col>

          {
            <Col md={6} xs={6}>
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
                  name="password"
                  control={control}
                  type="password"
                  label="Password"
                  errors={errors}
                  disabled={(model?.data && !model?.data?.phone) || readOnly}
                />
              </div>
            </Col>
          }

          <Col md={6}>
            <DateInputField
              name="birthdate"
              control={control}
              setValue={setValue}
              label="Date of Birth"
              placeholder="dd/mm/yy"
              errors={errors}
              disabled={model?.data && !model?.data?.phone}
            />
          </Col>

          {!(model?.data && !model?.data?.phone) && (
            <Col md={12}>
              <p
                onClick={() => setShowAddressForm(true)}
                outline
                color="secondary"
                className="w-auto"
                style={{ cursor: "pointer" }}
              >
                <code className="text-primary">
                  <i className="bx bx-location-plus"></i> Add new address
                </code>
              </p>
            </Col>
          )}

          {!(model?.data && !model?.data?.phone) &&
            addresses.map(({ address, _id }) => (
              <Col md={12} key={address}>
                <Alert className="py-2 position-relative">
                  <code style={{ color: "unset" }}>
                    {address.split("#")[0]}
                  </code>

                  <i
                    className="Profile__closeIcon bx bx-x position-absolute top-25 end-0 fs-3"
                    onClick={() => {
                      setModal(true);
                      setSelectedAddress({ _id, address });
                    }}
                  />
                </Alert>
              </Col>
            ))}
        </Row>

        <button
          className="Profile__btn mt-4"
          type="submit"
          disabled={loading || (model?.data && !model?.data?.phone)}
        >
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

      {showAddressForm && (
        <AddressForm
          user={model.data}
          addresses={addresses}
          showAddressForm={showAddressForm}
          setShowAddressForm={setShowAddressForm}
        />
      )}

      <div>
        <Modal
          isOpen={modal}
          toggle={() => setModal(!modal)}
          zIndex={2000}
          centered
        >
          <ModalHeader toggle={() => setModal(!modal)}>
            <div className="Header__logo">
              <h2 className="my-0">
                <Link to="/">
                  Shoes Store{" "}
                  <img className="img-fluid" src={brandLogo} alt="brandLogo" />
                </Link>
              </h2>
            </div>
          </ModalHeader>
          <ModalBody>
            Are you sure you want to remove address
            <code>{` ${selectedAddress?.address?.split("#")[0]} ?`}</code>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn btn-sm"
              color="primary"
              onClick={handleRemoveAddress}
              disabled={addressLoading}
            >
              Agree
              {addressLoading && <Spinner size="sm ms-2">Loading</Spinner>}
            </Button>{" "}
            <Button
              className="btn btn-sm"
              color="secondary"
              onClick={() => setModal(!modal)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
