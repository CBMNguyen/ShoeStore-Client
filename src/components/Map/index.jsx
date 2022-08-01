import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { STYLE_MODEL } from "constants/globals";
import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";

import Loading from "components/Loading";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Input, Modal, ModalBody } from "reactstrap";
import "./map.scss";

Map.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function Map({ onClose }) {
  const [map, setMap] = useState(null);

  const position = useMemo(
    () => ({
      lat: 10.070928,
      lng: 105.795405,
    }),
    []
  );

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(position);
    map.fitBounds(bounds);
    setMap(map);

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        calculateRoute(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          {
            lat: 10.070928,
            lng: 105.795405,
          }
        );
      },
      (error) => toast(error.message, { autoClose: 2000 }),
      { timeout: 2000 }
    );

    map.addListener("click", (mapsMouseEvent) => {
      console.log(mapsMouseEvent.latLng);
      calculateRoute(mapsMouseEvent.latLng, {
        lat: 10.070928,
        lng: 105.795405,
      });
    });
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  async function calculateRoute(origin = "", destination = "") {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin,
      destination: destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(map);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <div className="Map animation-fade-in" style={STYLE_MODEL}>
      <div onClick={() => onClose()} className="Map__close">
        <i className="bx bx-x" />
      </div>
      {!isLoaded && <Loading />}
      {isLoaded && (
        <GoogleMap
          zoom={15}
          center={position}
          onLoad={onLoad}
          onUnmount={onUnmount}
          mapContainerStyle={{
            width: "90%",
            height: "90%",
          }}
        >
          <Marker position={position} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          <div className="Map__control">
            <div onClick={toggle}>
              <i className="bx bx-search-alt-2"></i>
            </div>

            <Modal size="lg" isOpen={modal} toggle={toggle}>
              <ModalBody>
                <div className="d-flex">
                  <div style={{ width: "34%" }}>
                    <Autocomplete>
                      <Input type="text" placeholder="Origin" ref={originRef} />
                    </Autocomplete>
                  </div>

                  <div className="mx-2" style={{ width: "35%" }}>
                    <Autocomplete>
                      <Input
                        type="text"
                        placeholder="Destination"
                        ref={destinationRef}
                      />
                    </Autocomplete>
                  </div>

                  <button
                    type="submit"
                    onClick={calculateRoute(
                      originRef?.current?.value,
                      destinationRef?.current?.value
                    )}
                    className="Map__calculateRouteBtn"
                  >
                    Calculate Route
                  </button>

                  <button className="Map__closeIcon" onClick={clearRoute}>
                    Clear
                  </button>
                </div>
                <div className="mt-4 d-flex px-2">
                  <p style={{ width: "35%" }}>Distance: {distance}</p>

                  <p style={{ width: "34%" }}>Duration: {duration}</p>

                  <div className="Map__navigationIcon">
                    <i
                      className="bx bx-navigation"
                      onClick={() => {
                        map.panTo(position);
                        map.setZoom(15);
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </GoogleMap>
      )}
    </div>
  );
}

export default Map;
