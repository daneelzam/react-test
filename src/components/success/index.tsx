import React from 'react';
import {useNavigate} from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <div className="success" data-testid="success">SUCCESS!</div>
      <button className="button" onClick={()=>navigate('/send')}>Back</button>
    </div>
  );
}

export default Success;
