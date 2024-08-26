// src/App.js
import React from 'react';

const News = () => {
  const src = "https://www.addustour.com/search.php?search=%D8%A7%D9%86%D8%AA%D8%AE%D8%A7%D8%A8%D8%A7%D8%AA"; // استبدل بـ URL الموقع الخارجي

  const iframeContainerStyle = {
    width: '100%',      
    height: '800px',     
    overflow: 'hidden', 
    position: 'relative' 
  };

  const iframeStyle = {
    position: 'absolute',
    top: '-120px',  
    width: '100%',
    height: '1000px',
    border: 'none'
  };

  return (
    <div className="App">
      {/* <h1>Embed External Content</h1> */}
      <div style={iframeContainerStyle}>
        <iframe 
          src={src} 
          style={iframeStyle}
          title="Embedded Content"
        />
      </div>
    </div>
  );
};

export default News;
