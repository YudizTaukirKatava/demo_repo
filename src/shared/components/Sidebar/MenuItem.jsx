import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MenuItem({ item, isMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const childPaths =
    item.children && item?.children?.map((i) => i?.path?.split("/")[1]);
  const location = useLocation();
  const currentPathSlashIndex = location.pathname.split("/").length;
  const toggle = () => setIsOpen(!isOpen);
  return (
    <li onClick={toggle} className={isOpen ? "open" : ""}>
      <span className={isOpen == true ? "toggle-btn-open" : ""}>
        <NavLink
          onClick={toggle}
          to={item.path}
          activeclassName={`active ${!item.children && "pe-none"} `}
          className={
            childPaths?.includes(location.pathname.split("/")[1])
              ? "active pe-none"
              : ""
          }
        >
          <i>
            <FontAwesomeIcon icon={item.icon} />
          </i>
          <div className="side-bar-text">{isMenuOpen && item.title}</div>
          {item.children && isMenuOpen && (
            <i className="icon-arrow-drop-down drop-icon"></i>
          )}
        </NavLink>
      </span>
      {item.children && (
        <>
          <ul className={`left-arrow sidebar-dropdown dropdown-menu show big`}>
            {item?.children?.map((subItem) => {
              return (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    activeclassName={`active ${
                      (currentPathSlashIndex === 3 ||
                        currentPathSlashIndex === 2) &&
                      "pe-none"
                    }`}
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </li>
  );
}
MenuItem.propTypes = {
  item: PropTypes.object,
  isMenuOpen: PropTypes.bool,
};
export default MenuItem;
