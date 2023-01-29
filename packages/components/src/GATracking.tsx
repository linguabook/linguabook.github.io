import React from 'react';
import { initialize, pageview } from 'react-ga';
import { useLocation } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const GA_TRACKING_ID = 'G-SHK7Q8TMPJ';
initialize(GA_TRACKING_ID);

const GATracking: React.FC<Props> = ({ children }) => {
 const location = useLocation();
  React.useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return (
    <>
    {children}
    </>
  )
}

export default GATracking;
