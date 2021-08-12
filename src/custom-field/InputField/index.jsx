import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  control: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
};

InputField.defaultProps = {
  label: "",
  type: "text",
  disabled: false,
  placeholder: "",
  className: "",
  readOnly: false,
};

function InputField(props) {
  const {
    name,
    label,
    type,
    disabled,
    placeholder,
    className,
    control,
    errors,
    readOnly,
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const showError = !!errors[name];
        return (
          <FormGroup className="mb-1 mt-1">
            {label && (
              <Label className="mb-1" for={field.name}>
                {label}
              </Label>
            )}
            <Input
              {...field}
              className={className}
              id={name}
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              invalid={showError}
              readOnly={readOnly}
            />
            {showError && (
              <FormFeedback>{errors[name]["message"]}</FormFeedback>
            )}
          </FormGroup>
        );
      }}
    />
  );
}

export default InputField;
