import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';

import { auth } from './configs/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Blog, CreateBlog } from './pages/Blog';
import NotFound from './components/NotFound';
import Loader from './components/Loader';


function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  React.useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <React.Suspense>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="admin/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route path="admin/blog/create"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin/blog" element={<Blog to="/admin/blog" />} />
          <Route path="/admin/blog/create" element={<CreateBlog to="/admin/blog/create" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
}

export default App;
