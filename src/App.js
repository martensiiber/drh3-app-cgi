import React from 'react';
import MapApp from "./MapApp";

import './App.css';
import InfoPage from "./components/InfoPage/InfoPage";
import MainContent from "./components/MainContent/MainContent";

function App() {
  return (
    <div className="app">
        <InfoPage />
        <MainContent/>
      {/*<MapApp />*/}
    </div>
  );
}

export default App;