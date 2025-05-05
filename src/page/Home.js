import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home" onClick={() => navigate('/genre')}>
      {/* <h1>Home</h1> */}
    </div>
  );
};

export default Home;
