import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";
import { FormGroup, Input, Label } from "reactstrap";

CheckBoxField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  control: PropTypes.object.isRequired,
};

CheckBoxField.defaultProps = {
  label: "",
  type: "text",
  disabled: false,
  placeholder: "",
  className: "",
};

function CheckBoxField(props) {
  const { name, label, type, disabled, placeholder, className, control } =
    props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormGroup className="mb-1 mt-1 d-flex me-4">
          <Input
            {...field}
            checked={field.value}
            id={name}
            className={className}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
          />
          {label && <Label for={field.name}>{label}</Label>}
        </FormGroup>
      )}
    />
  );
}

export default CheckBoxField;
