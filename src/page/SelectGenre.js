import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SelectGenre.css';
import button from './button.png';

function Selectgenre() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/videos')
      .then((response) => {
        console.log('Fetched genres:', response.data);
        setGenres(response.data);
      })
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  const handleGenreClick = (genre) => {
    navigate(`/videos/${genre}`);
  };

  return (
    <div className="bg-genre">
      <div className="genre">
        <div className="button" onClick={() => navigate('/')}>
          <img src={button} width={50} height={50} alt="logo" />
        </div>
        <div className="genre-grid">
          {genres.map((genreData, index) => (
            <div
              key={index}
              className="genre-card"
              onClick={() => handleGenreClick(genreData.genre)}
            >
              {genreData.genre}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Selectgenre;
