import addressApi from "api/address";
import { createAddress } from "app/addressSlice";
import axios from "axios";
import Loading from "components/Loading";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import "./addressForm.scss";

function AddressForm({ user, showAddressForm, addresses, setShowAddressForm }) {
  const dispatch = useDispatch();

  // Set filter when change
  const [filter, setFilter] = useState({
    cityCode: null,
    districtCode: null,
    wardCode: null,
  });

  const [specificAddress, setSpecificAddress] = useState("");

  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [loadAddress, setLoadAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch city on Province page
  useEffect(() => {
    const fetchCity = async () => {
      const City = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: {
            token: process.env.REACT_APP_GHN_TOKEN,
          },
        }
      );
      const data = City?.data?.data || [];
      const cityOptions = data.map((ct) => ({
        label: ct.ProvinceName,
        value: ct.ProvinceID,
      }));

      setCity(cityOptions);
    };
    fetchCity();
  }, []);

  // Fetch district when city change
  useEffect(() => {
    const fetchDistrict = async () => {
      if (filter.cityCode === null) return;
      setLoadAddress(true);

      const District = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${filter.cityCode}`,
        {
          headers: {
            token: process.env.REACT_APP_GHN_TOKEN,
          },
        }
      );
      const data = District?.data?.data || [];
      const districtOptions = data.map((ct) => ({
        label: ct.DistrictName,
        value: ct.DistrictID,
      }));

      setLoadAddress(false);
      setDistrict(districtOptions);
    };
    fetchDistrict();
  }, [filter]);

  // Fetch commune when district change
  useEffect(() => {
    const fetchWard = async () => {
      if (filter.districtCode === null) return;
      setLoadAddress(true);
      const Ward = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${filter.districtCode}`,
        {
          headers: {
            token: process.env.REACT_APP_GHN_TOKEN,
          },
        }
      );

      const data = Ward?.data?.data || [];
      const wardOptions = data.map((ct) => ({
        label: ct.WardName,
        value: ct.WardCode,
      }));
      setLoadAddress(false);
      setWard(wardOptions);
    };
    fetchWard();
  }, [filter]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const cityName = city.find(
        (item) => item.value.toString() === filter.cityCode
      ).label;
      const districtName = district.find(
        (item) => item.value.toString() === filter.districtCode
      ).label;
      const wardName = ward.find(
        (item) => item.value.toString() === filter.wardCode
      ).label;

      const address = `${specificAddress} ${wardName} ${districtName} ${cityName}#${filter.districtCode}#${filter.wardCode}`;
      setLoading(true);
      await dispatch(createAddress({ user: user._id, address }));
      toast("Successfully added address.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      setLoading(false);
      setShowAddressForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      className="AddressForm shadow"
      style={showAddressForm ? { transform: "translateX(0)", opacity: 1 } : {}}
    >
      <div
        className="AddressForm__closeIcon"
        onClick={() => setShowAddressForm(false)}
      >
        <i className="bx bx-x text-secondary" />
      </div>

      <h6 className="mb-5">
        <code className="text-secondary fs-5">Address Form</code>
      </h6>

      <Row className="position-relative">
        {loadAddress && (
          <div className="position-absolute" style={{ top: "12px" }}>
            <Loading />
          </div>
        )}

        <Col md={12}>
          {/* City */}
          <FormGroup floating>
            <Input
              id="city"
              name="city"
              required
              onChange={(e) =>
                setFilter({ ...filter, cityCode: e.target.value })
              }
              type="select"
            >
              <option value="">Select Provice / City</option>
              {city.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Input>
            <Label for="city">City / Province</Label>
          </FormGroup>
        </Col>

        {/* District */}
        <Col md={12}>
          <FormGroup floating>
            <Input
              id="district"
              name="district"
              required
              onChange={(e) =>
                setFilter({ ...filter, districtCode: e.target.value })
              }
              type="select"
            >
              <option value="">Select District</option>
              {district.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Input>
            <Label for="district">District</Label>
          </FormGroup>
        </Col>

        {/* Commune */}
        <Col md={12}>
          <FormGroup floating>
            <Input
              id="commune"
              required
              name="select"
              type="select"
              onChange={(e) =>
                setFilter({ ...filter, wardCode: e.target.value })
              }
            >
              <option value="">Select Wards / Commune</option>
              {ward.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Input>
            <Label for="commune">Wards / Commune</Label>
          </FormGroup>
        </Col>

        <Col md={12}>
          <FormGroup floating>
            <Input
              id="address"
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
              required
            />
            <Label for="address">Specific Address</Label>
          </FormGroup>
        </Col>

        <Col md={12}>
          <Button
            disabled={loading}
            type="submit"
            style={{ backgroundColor: "deeppink" }}
            className="text-white rounded-1  p-3 border-0 w-100 position-relative"
          >
            {loading && (
              <Spinner
                className="position-absolute bottom-0 end-0 m-2"
                size="sm"
              >
                Loading...
              </Spinner>
            )}
            <code className="text-white fs-6">Add New Address</code>
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default AddressForm;
