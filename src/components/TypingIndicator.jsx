import React from 'react';

const CustomTypingIndicator = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
      <div style={{ marginRight: '8px', width: '10px', height: '10px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
      <div style={{ marginRight: '8px', width: '10px', height: '10px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
      <div style={{ width: '10px', height: '10px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
    </div>
  );
};

export default CustomTypingIndicator;
