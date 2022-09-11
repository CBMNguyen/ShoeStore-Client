import { STAR_COLORS, STAR_MEANINGS } from "constants/globals";
import React, { Component } from "react";
import Star from "../Star/index";

class Rating extends Component {
  static defaultProps = { max: 5 };
  constructor(props) {
    super(props);
    this.state = {
      dynamicValue: props.stars,
      value: props.stars,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  handleClick(newValue) {
    this.setState({
      value: newValue,
      dynamicValue: newValue,
    });
  }
  handleMouseEnter(newValue) {
    this.setState({ dynamicValue: newValue });
  }

  handleMouseLeave(newValue) {
    this.setState({ dynamicValue: this.state.value });
  }

  render() {
    const { dynamicValue, value } = this.state;
    const starSpans = [];
    const max = this.props.max;
    let count = dynamicValue;
    for (let v = 1; v <= max; v++) {
      starSpans.push(
        <Star
          key={v}
          color={STAR_COLORS[count]}
          isFilled={v <= dynamicValue}
          value={v}
          handleHover={this.handleMouseEnter}
          handleHoverLeave={this.handleMouseLeave}
          handleClick={this.handleClick}
        />
      );
    }
    return (
      <div className="d-flex align-items-center">
        {starSpans}
        <code className="mt-1 ms-4 text-dark">{STAR_MEANINGS[value]}</code>
      </div>
    );
  }
}
export default Rating;
