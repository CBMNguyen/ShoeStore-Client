import React from "react";
import PropTypes from "prop-types";
import "./sidebar.scss";

SideBar.propTypes = {};

function SideBar(props) {
  return (
    <div className="SideBar">
      <ul>
        <li>
          <span>
            Brand
            <i class="bx bx-chevron-down" />
          </span>
          <div>
            <input type="checkbox" /> <label>Nike</label>
          </div>
          <div>
            <input type="checkbox" /> <label>Adidas</label>
          </div>
          <div>
            <input type="checkbox" /> <label>Puma</label>
          </div>
          <div>
            <input type="checkbox" /> <label>Converse</label>
          </div>
          <div></div>
        </li>
        <li>
          <span>Price Range</span>
          <input type="range" />
        </li>
        <li>
          <span>Color</span>
        </li>
        <li>
          <span>Size</span>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
