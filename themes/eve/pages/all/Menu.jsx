import PropTypes from "prop-types";
import React from "react";

export default function Menu({ menu: { items } }) {
  return (
    <div className="main-menu self-center hidden sm:block">
      <ul className="nav flex space-x-6 justify-center">
        {items.map((i, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className="nav-item" key={index}>
            <a className="nav-link hover:underline" href={i.url}>
              {i.name}
            </a>
          </li>
        ))}
        <li className="nav-item">
          <a className="nav-link hover:underline" href={"/men"} style={{ padding: "0px 10px" }}>
            Men
          </a>
          <a>-</a>
          <a className="nav-link hover:underline" href={"/women"} style={{ padding: "0px 10px" }}>
            Women
          </a>
        </li>
      </ul>
    </div>
  );
}

Menu.propTypes = {
  menu: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export const layout = {
  areaId: "header",
  sortOrder: 1,
};

export const query = `
  query {
    menu {
      items {
        name
        url
      }
    }
}`;
