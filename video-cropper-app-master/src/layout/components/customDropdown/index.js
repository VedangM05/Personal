import React, { useState } from "react";
import classes from "./styles.module.css";

const CustomDropdown = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={classes.customDropdown}>
      <div
        className={classes.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {label}{" "}
          <span className={classes.selectedValue}>{selected.label}</span>
        </span>
        <span className={classes.dropdownArrow}>▾</span>
      </div>
      {isOpen && (
        <div className={classes.dropdownMenu}>
          {options &&
            options.map((option) => {
              const isSelected = option.value === selected.value;

              return (
                <div
                  key={option.value}
                  className={`${classes.dropdownItem} ${
                    isSelected ? classes.selected : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  {isSelected && <span className={classes.checkmark}>✓</span>}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
