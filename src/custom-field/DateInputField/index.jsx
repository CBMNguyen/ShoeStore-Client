import PropTypes from "prop-types";
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { FormFeedback, FormGroup, Label } from "reactstrap";
import styled, { css } from "styled-components";

DateInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  control: PropTypes.object.isRequired,
};

DateInputField.defaultProps = {
  label: "",
  placeholder: "",
};

function DateInputField(props) {
  const { name, label, placeholder, control, errors, disabled } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const showError = !!errors[name]?.message;
        return (
          <FormGroup className="mb-1 mt-1">
            <div>
              {label && (
                <Label className="mb-1" for={field.name}>
                  {label}
                </Label>
              )}
            </div>
            <ReactDatePicker
              {...field}
              dateFormat="dd/MM/yyyy"
              selected={field.value}
              showTimeSelect={false}
              todayButton="Shoes Store"
              dropdownMode="select"
              isClearable
              placeholderText={placeholder}
              shouldCloseOnSelect
              customInput={<StyledInput errors={errors} />}
              showYearDropdown
              disabled={disabled}
            />
            <div className="is-invalid"></div>
            {showError && (
              <FormFeedback>{errors[name]?.["message"]}</FormFeedback>
            )}
          </FormGroup>
        );
      }}
    />
  );
}

const StyledInput = styled.input.attrs((props) => ({
  autoComplete: "off",
  autoFocus: false,
  // errors: props.errors
}))`
  background-clip: padding-box;
  background-color: #fff;
  border: none;
  border-bottom: 2px solid #ec5990;
  border-radius: 0.25rem;
  box-sizing: border-box;
  display: block;
  font-size: 1rem;
  height: 2.5rem;
  line-height: 1.5;
  padding: 0.5rem 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: 100%;

  &:focus {
    color: black;
    outline: 0;
  }

  ::-webkit-input-placeholder {
    color: #c0c0c0;
  }

  :-ms-input-placeholder {
    color: #c0c0c0;
  }

  :-moz-placeholder {
    color: #c0c0c0;
    opacity: 1;
  }

  ${({ errors }) =>
    Object.keys(errors).length !== 0 &&
    errors &&
    css`
      background: rgb(251, 236, 242);
      border-color: rgb(191, 22, 80) rgb(191, 22, 80) rgb(191, 22, 80)
        rgb(236, 89, 144);
      border-image: initial;
      border-style: solid;
      border-width: 1px 1px 1px 10px;
    `}
`;

export default DateInputField;
