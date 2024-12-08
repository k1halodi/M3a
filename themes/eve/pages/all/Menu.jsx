import PropTypes from "prop-types";
import React from "react";

export default function Menu({ menu: { items } }) {
  return (
    <div className="main-menu self-center hidden md:block">
      <ul className="nav flex space-x-6 justify-center">
        {items.map((i, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className="nav-item" key={index} style={{ margin: "0 10px" }}>
            <a className="nav-link hover:underline" href={i.url} style={{ padding: "0px 10px" }}>
              {i.name}
            </a>
          </li>
        ))}
        <li className="nav-item" style={{ margin: "0 10px" }}>
          <a className="nav-link hover:underline" href={"/#"} style={{ padding: "0px 20px" }}>
            Home
          </a>
          <a>-</a>
          <a className="nav-link hover:underline" href={"/men"} style={{ padding: "0px 20px" }}>
            Men
          </a>
          <a>-</a>
          <a className="nav-link hover:underline" href={"/women"} style={{ padding: "0px 20px" }}>
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
