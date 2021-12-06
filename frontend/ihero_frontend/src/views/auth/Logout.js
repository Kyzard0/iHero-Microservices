import React, { useState, useEffect, Fragment } from 'react';

const Logout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      window.location.replace('/login');
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = e => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('/login');
  };

  return (
    <div className="main_card">
      {loading === false && (
        <Fragment>
          <div className='form_card'>
            <h1>Are you sure you want to logout?</h1>
            <input className="btn btn-lg btn-primary btn-block" type='button' value='Logout' onClick={handleLogout} />
          </div>

        </Fragment>
      )}
    </div>
  );
};

export default Logout;
