import React from "react";

const FormRow = ({ id, name, type, value, inputChangeHandler, labelText }) => {
  return (
    <div>
      <label htmlFor={id}>{labelText}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={value}
        value={value}
        onChange={inputChangeHandler}
      />
    </div>
  );
};

export default FormRow;
