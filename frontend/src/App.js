 //app.js
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthContainer from './containers/AuthContainer';
import { JobContainer } from './containers/JobContainer';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import BookmarksContainer from './containers/BookmarksContainer';
import { DragDropProvider } from './context/DragDropContext';
import { JobProvider } from './context/JobContext';
import JobDetails from './components/JobDetails';

  function App() {

    return (
      <GoogleOAuthProvider clientId="1007180862161-lu06qa779qu3v20l1jsrp4ttaj10a4qe.apps.googleusercontent.com">
      <BrowserRouter>
        <div className="App">
          <JobProvider>
          <DragDropProvider>
          <AuthContainer />
          <Routes>
            <Route path="/jobs" element={<JobContainer />} />
            <Route path="/bookmarks" element={<BookmarksContainer />} />
            <Route path='/job/:id' element={<JobDetails />}/>
          </Routes>
          </DragDropProvider>
          </JobProvider>

        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
      
    );
  }

  export default App;
