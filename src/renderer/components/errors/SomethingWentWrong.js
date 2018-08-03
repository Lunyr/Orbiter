import React from 'react';

const SomethingWentWrong = ({ error, info }) => (
  <div style={{ height: '100%', width: '100%', overflowY: 'auto' }}>
    <h1>Something went wrong.</h1>
    <div>Info: {JSON.stringify(info)}</div>
    <br />
    <div>Error: {JSON.stringify(error)}</div>
  </div>
);

export default SomethingWentWrong;
