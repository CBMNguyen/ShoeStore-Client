import userApi from "api/user";
import Loading from "components/Loading";
import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import brandLogo from "../../assets/images/brandLogo.png";
import "./resetpassword.scss";

function ResetPassWord(props) {
  const params = useParams();
  const history = useHistory();
  const [email, setEmail] = useState(params.email || " ");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await userApi.resetPassword({ email });
      setLoading(false);
      toggle();
    } catch (error) {
      setLoading(false);

      toast.error(error.message);
    }
  };
  return (
    <div className="ResetPassWord">
      <div className="ResetPassWord__form-wrapper">
        <div className="ResetPassWord__logo">
          <h2>
            <Link to="/">
              Shoes Store <img src={brandLogo} alt="brandLogo" />
            </Link>
          </h2>
        </div>

        <div className="ResetPassWord__about">
          <h2>Reset your password</h2>
          <p>
            To reset your password, enter your email below and submit. An email
            will be sent to you with instructions about how to complete the
            process.
          </p>
        </div>

        <Form onSubmit={handleResetPasswordSubmit}>
          <FormGroup>
            <Label for="email" className="fw-bold">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email..."
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          <button
            disabled={loading}
            className="ResetPassWord__btn shadow"
            type="submit"
          >
            Reset Password
          </button>
          {loading && <Loading />}
        </Form>
      </div>
      <div className="ResetPassWord__background" />

      <Modal isOpen={modal} toggle={toggle}>
        {/* <ModalHeader toggle={toggle}>Shoes Store</ModalHeader> */}
        <ModalBody className="pb-0">
          <p>
            We have successfully sent your new password to your email. <br />
            Please return to the website and re-login with the latest password.{" "}
            <br />
            Thank you very much.❤️
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn btn-sm"
            color="danger"
            onClick={() => {
              toggle();
              history.push("/");
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ResetPassWord;
