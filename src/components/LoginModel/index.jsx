import { yupResolver } from "@hookform/resolvers/yup";
import { STYLE_MODEL } from "constants/globals";
import InputField from "custom-field/InputField";
import firebase from "firebase";
import PropTypes from "prop-types";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Form, Spinner } from "reactstrap";
import * as yup from "yup";
import brandLogo from "../../assets/images/brandLogo.png";
import "./login.scss";

LoginModel.propTypes = {
  showModel: PropTypes.func.isRequired,
  closeModel: PropTypes.func.isRequired,
  onLogin: PropTypes.func,
};

function LoginModel(props) {
  const { showModel, closeModel, onLogin } = props;
  const { loading } = useSelector((state) => state.user);

  const history = useHistory();

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
    getValues,
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    if (!onLogin) return;
    onLogin(data);
  };
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => closeModel(),
    },
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = getValues().email || " ";
    history.push(`/resetpassword/${email}`);
  };

  return (
    <div className="LoginModel animation-fade-in" style={STYLE_MODEL}>
      <Form className="form" onSubmit={handleSubmit(onSubmit)}>
        <header>
          Shoes Store <img src={brandLogo} alt="branchLogo" />
        </header>

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
        <a href="/#" onClick={handleResetPassword}>
          Forgot Password ?
        </a>
        <Button
          disabled={loading}
          className="d-block w-100 m-auto mt-2 mb-2 btn"
        >
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
        {/* Login with social media */}
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
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
