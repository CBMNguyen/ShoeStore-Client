import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { FormFeedback, FormGroup, Label } from "reactstrap";

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  control: PropTypes.object.isRequired,
  isMulty: PropTypes.bool,
};

SelectField.defaultProps = {
  label: "",
  options: [],
  disabled: false,
  placeholder: "",
  isMulty: false,
};

function SelectField(props) {
  const {
    name,
    label,
    options,
    disabled,
    placeholder,
    control,
    errors,
    isMulty,
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
            <Select
              {...field}
              className={showError ? "text-dark is-invalid" : "text-dark"}
              id={name}
              isMulti={isMulty}
              options={options}
              disabled={disabled}
              placeholder={placeholder}
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

export default SelectField;
