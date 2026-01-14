import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './routes/RouterConfig';
import AnimeRouter from './routes/AnimeRouter';

const App: React.FC = () => {
  return (
    <Router 
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}
    >
      <AnimeRouter />
      {/* <RouterConfig /> */}
    </Router>
  );
};

export default App;