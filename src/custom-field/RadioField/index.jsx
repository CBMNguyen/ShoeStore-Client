import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";
import { FormGroup, Input, Label } from "reactstrap";

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
};

RadioField.defaultProps = {
  label: "",
  type: "text",
  disabled: false,
  placeholder: "",
  className: "",
};

function RadioField(props) {
  const {
    name,
    label,
    type,
    disabled,
    placeholder,
    className,
    control,
    setValue,
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormGroup className="mb-1 mt-1">
          <Input
            {...field}
            id={name}
            className={className}
            onChange={() => setValue(name, label)}
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

export default RadioField;
