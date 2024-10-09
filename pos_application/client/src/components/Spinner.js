import React from "react";

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">กำลังโหลด...</span>
      </div>
    </div>
  );
};

export default Spinner;
