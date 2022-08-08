import React from "react";
import PropTypes from "prop-types";
import { Form } from "reactstrap";
import { STYLE_MODEL } from "constants/globals";
import brandLogo from "../../../../assets/images/brandLogo.png";

CheckoutModal.propTypes = {};

function CheckoutModal(props) {
  return (
    <div className="CheckoutModal animation-fade-in" style={STYLE_MODEL}>
      <Form>
        <header>
          Shoes Store <img src={brandLogo} alt="branchLogo" />
        </header>
        aad
      </Form>
    </div>
  );
}

export default CheckoutModal;
