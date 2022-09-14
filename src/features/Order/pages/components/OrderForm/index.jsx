import { yupResolver } from "@hookform/resolvers/yup";
import { EMAIL_REGEX, PHONE_REGEX } from "constants/globals";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";
import cod from "../../../../../assets/images/cod.svg";
import other from "../../../../../assets/images/other.svg";

function OrderForm({
  user,
  addresses,
  showAddressForm,
  setShowAddressForm,
  setSelectedAddress,
  onCheckoutSubmit,
  setPaymentMethod,
  paymentMethod,
  loadingMoMo,
  savedOrder,
}) {
  const defaultValues = {
    fullname: savedOrder ? savedOrder.fullname : user.firstname + user.lastname,
    email: savedOrder ? savedOrder.email : user.email,
    phone: savedOrder ? savedOrder.phone : user.phone,
    address: "",
  };

  // yup schema
  const schema = yup.object().shape({
    fullname: yup.string().required("This field is require."),
    email: yup
      .string()
      .matches(EMAIL_REGEX, "Please enter correct email!")
      .required("This field is require."),
    phone: yup
      .string()
      .required("this field is require.")
      .matches(PHONE_REGEX, "Please enter correct phone number!"),
    address: yup.string().required("This field is require."),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    if (!onCheckoutSubmit) return;
    onCheckoutSubmit(data);
  };
  return (
    <div className="OrderForm" onSubmit={handleSubmit(onSubmit)}>
      <Form>
        <Row>
          <Col md={12}>
            <Controller
              name="fullname"
              control={control}
              render={({ field }) => (
                <FormGroup floating>
                  <Input
                    {...field}
                    id="fullname"
                    invalid={!!errors.fullname}
                    valid={!errors.fullname?.message && !!getValues("fullname")}
                  />
                  <Label for="fullname">Full Name</Label>
                  <FormFeedback
                    invalid={errors.fullname}
                    valid={!errors.fullname?.message && !!getValues("fullname")}
                  >
                    {errors.fullname?.message}
                  </FormFeedback>
                </FormGroup>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormGroup floating>
                  <Input
                    {...field}
                    id="email"
                    invalid={!!errors.email}
                    valid={
                      !errors.email?.message &&
                      !!getValues("email").match(EMAIL_REGEX)
                    }
                  />
                  <Label for="email">Email</Label>
                  <FormFeedback
                    valid={
                      !errors.email?.message &&
                      !!getValues("email").match(EMAIL_REGEX)
                    }
                    invalid={errors.email}
                  >
                    {errors.email?.message}
                  </FormFeedback>
                </FormGroup>
              )}
            />
          </Col>
          <Col md={4}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <FormGroup floating>
                  <Input
                    {...field}
                    id="phone"
                    valid={
                      !errors.phone?.message &&
                      !!getValues("phone").match(PHONE_REGEX)
                    }
                    invalid={!!errors.phone}
                  />
                  <Label for="phone">Phone</Label>
                  <FormFeedback
                    valid={
                      !errors.phone?.message &&
                      !!getValues("phone").match(PHONE_REGEX)
                    }
                    invalid={errors.phone}
                  >
                    {errors.phone?.message}
                  </FormFeedback>
                </FormGroup>
              )}
            />
          </Col>
        </Row>

        <Row>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <FormGroup floating>
                <Input
                  {...field}
                  id="address"
                  type="select"
                  invalid={!!errors.address}
                  valid={!errors.address?.message && !!getValues("address")}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setSelectedAddress(e.target.value);
                  }}
                >
                  {addresses.length === 0 ? (
                    <option value="">
                      You do not have an address. Please add an address to
                      order...
                    </option>
                  ) : (
                    <option value="">Select address...</option>
                  )}
                  {addresses.map(({ address }) => (
                    <option key={address} value={address}>
                      {address.split("#")[0]}
                    </option>
                  ))}
                </Input>
                <Label for="address" style={{ marginLeft: "12px" }}>
                  Address
                </Label>
                <FormFeedback
                  valid={!errors.address?.message && !!getValues("address")}
                  invalid={errors.address}
                >
                  {errors.address?.message}
                </FormFeedback>
              </FormGroup>
            )}
          />

          <FormGroup>
            <label htmlFor="nav-mobile-input" className="nav__mobile-btn me-2">
              <Button
                onClick={() => setShowAddressForm(true)}
                outline
                color="secondary"
                className="w-auto"
              >
                <i className="bx bx-location-plus"></i> Add new address
              </Button>

              <label
                onClick={() => setShowAddressForm(false)}
                htmlFor="nav-mobile-input"
                className={
                  showAddressForm ? "nav__over-lay d-block" : "nav__over-lay"
                }
              ></label>
            </label>
          </FormGroup>
        </Row>

        {/* Payment method */}
        <FormGroup onChange={(e) => e.target.value} row tag="fieldset">
          <h4 className="mb-3">
            <code className="text-secondary">Payment Method</code>
          </h4>
          <FormGroup check>
            <Input
              defaultChecked={
                savedOrder ? !savedOrder.paymentMethod : !paymentMethod
              }
              style={{ cursor: "pointer" }}
              id="paymentMethodDelivery"
              name="paymentMethod"
              className="mt-3 me-4"
              type="radio"
              value={false}
              onChange={() => setPaymentMethod(false)}
            />
            <Label
              check
              for="paymentMethodDelivery"
              className="mt-1"
              style={{ cursor: "pointer" }}
            >
              {" "}
              <img src={cod} alt="cod" />
              <code className="text-secondary fs-6 ms-3">
                Payment on delivery
              </code>
            </Label>
          </FormGroup>

          {/* Payment online method */}
          <FormGroup check>
            <Input
              defaultChecked={
                savedOrder ? savedOrder.paymentMethod : paymentMethod
              }
              id="paymentMethodOnline"
              name="paymentMethod"
              className="mt-3 me-4"
              type="radio"
              onChange={() => setPaymentMethod(true)}
              style={{ cursor: "pointer" }}
            />
            <Label
              check
              for="paymentMethodOnline"
              className="mt-1"
              style={{ cursor: "pointer" }}
            >
              {" "}
              <img src={other} alt="other" />
              <code className="text-secondary fs-6 ms-3">Online Payment</code>
            </Label>
          </FormGroup>
        </FormGroup>

        <Row className="mt-2">
          <Col md={2}>
            <Link to="/cart" className="text-decoration-none fs-4">
              <code>Cart</code>
            </Link>
          </Col>
          <Col md={10}>
            <Button
              type="submit"
              disabled={loadingMoMo || isSubmitting}
              style={{ backgroundColor: "deeppink" }}
              className="text-white rounded-1 float-end p-3 border-0"
            >
              Complete payment
              {(loadingMoMo || isSubmitting) && (
                <Spinner size="sm" className="ms-2">
                  Loading
                </Spinner>
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default OrderForm;
