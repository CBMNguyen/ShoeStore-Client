import React from "react";
import PropTypes from "prop-types";
import "./pagination.scss";
import { Button } from "reactstrap";
import classNames from "classnames";

Pagination.propTypes = {
  filter: PropTypes.object.isRequired,
  onPageChange: PropTypes.func,
};

Pagination.defaultProps = {
  onPageChange: null,
};

function Pagination(props) {
  const { filter, onPageChange, totalRow } = props;
  const { page, limit } = filter;
  const totalPage = Math.ceil(totalRow / limit);

  const handlePageChange = (page) => {
    if (!onPageChange) return;
    onPageChange(page);
  };

  // fake array to render number item
  let filterList = [];
  if (totalPage >= 4) {
    filterList = [1, 2, 3, 4];
  } else if (totalPage === 3) {
    filterList = [1, 2, 3];
  } else if (totalPage === 2) {
    filterList = [1, 2];
  } else {
    filterList = [1];
  }

  return (
    <div className="Pagination">
      {/* previous button */}
      <Button
        className="btn btn-sm"
        type="button"
        color="light"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <i className="bx bx-chevron-left d-inline-block m-auto" />
      </Button>
      {/* numbers */}
      {filterList.map((item) => (
        <button
          disabled={totalPage < item}
          key={item}
          className={classNames("Pagination__number", {
            "Pagination__number--active": page === item || page === item + 4,
          })}
          onClick={() => handlePageChange(item)}
        >
          {page > 4 ? item + 4 : item}
        </button>
      ))}

      {/* Next Button */}
      <Button
        className="btn btn-sm"
        type="button"
        color="light"
        disabled={page >= totalPage}
        onClick={() => handlePageChange(page + 1)}
      >
        <i className="bx bx-chevron-right d-inline-block m-auto" />
      </Button>
    </div>
  );
}

export default Pagination;
