import React from 'react';
import '../styles/PageWrapper.css';

const PageWrapper = ({ children }) => {
  return <div className="page-wrapper">{children}</div>;
};

export default PageWrapper;