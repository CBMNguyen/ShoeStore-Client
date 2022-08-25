import { STYLE_MODEL } from "constants/globals";
import PropTypes from "prop-types";

import "./map.scss";

Map.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function Map({ onClose }) {
  return (
    <div className="Map animation-fade-in" style={STYLE_MODEL}>
      <div onClick={() => onClose()} className="Map__close">
        <i className="bx bx-x" />
      </div>

      <iframe
        title="map"
        width="90%"
        height="90%"
        frameborder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&q=Cầu+Thành+Lợi,+Vĩnh+Long,+Vietnam`}
        allowfullscreen
      />
    </div>
  );
}

export default Map;
