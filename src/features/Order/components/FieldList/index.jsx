import CheckBoxField from "custom-field/CheckBoxField";
import InputField from "custom-field/InputField";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import { Col, FormFeedback, FormGroup, Label } from "reactstrap";

FieldList.propTypes = {
  city: PropTypes.array.isRequired,
  commune: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  district: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  selectedCity: PropTypes.object.isRequired,
  selectedDistrict: PropTypes.object.isRequired,
  selectedCommune: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
};

function FieldList(props) {
  const {
    city,
    commune,
    control,
    district,
    errors,
    filter,
    setFilter,
    setValue,
    selectedCity,
    selectedDistrict,
    selectedCommune,
    register,
  } = props;

  return (
    <div className="FieldList">
      <InputField
        name="fullName"
        control={control}
        label="Full Name"
        errors={errors}
      />

      <InputField
        name="phone"
        control={control}
        label="Phone"
        errors={errors}
        type="number"
      />

      {/* handle city change */}

      <Col>
        <FormGroup className="mb-1 mt-1">
          <Label className="mb-1" for={"city"}>
            City
          </Label>
          <Select
            {...register("city")}
            className={!!errors["city"] ? "text-dark is-invalid" : "text-dark"}
            id="city"
            options={city}
            defaultValue={selectedCity}
            onChange={(option) => {
              setValue("city", option);
              setFilter({ ...filter, cityCode: option.value });
            }}
          />
          {!!errors["city"] && (
            <FormFeedback>{errors["city"]["message"]}</FormFeedback>
          )}
        </FormGroup>
      </Col>

      {/* handle district change */}

      <FormGroup className="mb-1 mt-1">
        <Label className="mb-1" for={"district"}>
          District
        </Label>
        <Select
          {...register("district")}
          className={
            !!errors["district"] ? "text-dark is-invalid" : "text-dark"
          }
          id="district"
          options={district}
          defaultValue={selectedDistrict}
          onChange={(option) => {
            setValue("district", option);
            setFilter({ ...filter, districtCode: option.value });
          }}
        />
        {!!errors["district"] && (
          <FormFeedback>{errors["district"]["message"]}</FormFeedback>
        )}
      </FormGroup>

      {/* handle commune change */}

      <FormGroup className="mt-2 mb-3">
        <Label className="mb-1" for={"commune"}>
          Commune
        </Label>
        <Select
          {...register("commune")}
          className={!!errors["commune"] ? "text-dark is-invalid" : "text-dark"}
          id="commune"
          options={commune}
          defaultValue={selectedCommune}
          onChange={(option) => {
            setValue("commune", option);
          }}
        />
        {!!errors["commune"] && (
          <FormFeedback>{errors["commune"]["message"]}</FormFeedback>
        )}
      </FormGroup>

      <CheckBoxField
        className="me-2"
        name="isFullDay"
        control={control}
        label="Delivery every day of the week"
        errors={errors}
        type="checkbox"
      />

      <InputField
        name="description"
        control={control}
        label="Description"
        errors={errors}
        type="textarea"
      />
    </div>
  );
}

export default FieldList;
