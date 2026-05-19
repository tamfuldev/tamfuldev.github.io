import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import AdminDailyPlan from './pages/AdminDailyPlan';
import AdminProjects from './pages/AdminProjects';
import AdminRoadmap from './pages/AdminRoadmap';
import Login from './pages/Login';
import Base from './pages/Base';

import { auth } from './configs/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import NotFound from './components/NotFound';
import Loader from './components/Loader';
import { LanguageProvider } from './components/LanguageContext';

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
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
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
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Loader delay={400}/>
              <Base canAccessPrivatePages={Boolean(user)} />
            </>
          }
          />
          <Route path="/blog" element={
            <>
              <Loader delay={300} />
              <Base canAccessPrivatePages={Boolean(user)} initialPage="blog" />
            </>
          }
          />
          <Route path="/blog/:slug" element={
            <>
              <Loader delay={300} />
              <Base canAccessPrivatePages={Boolean(user)} initialPage="blog" />
            </>
          }
          />
          <Route path="/projects" element={
            <>
              <Loader delay={300} />
              <Base canAccessPrivatePages={Boolean(user)} initialPage="projects" />
            </>
          }
          />
          <Route path="/roadmap" element={
            <ProtectedRoute>
              <>
                <Loader delay={300} />
                <Base canAccessPrivatePages={Boolean(user)} initialPage="roadmap" />
              </>
            </ProtectedRoute>
          }
          />
          <Route path="/daily-plan" element={
            <ProtectedRoute>
              <>
                <Loader delay={300} />
                <Base canAccessPrivatePages={Boolean(user)} initialPage="dailyPlan" />
              </>
            </ProtectedRoute>
          }
          />
          <Route path="/market-analysis" element={
            <>
              <Loader delay={300} />
              <Base canAccessPrivatePages={Boolean(user)} initialPage="marketAnalysis" />
            </>
          }
          />
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
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="admin/blog/edit/:blogId"
            element={
              <ProtectedRoute>
                <Admin initialMode="edit" />
              </ProtectedRoute>
            }
          />
          <Route path="admin/blog/create"
            element={
              <ProtectedRoute>
                <Admin initialMode="create" />
              </ProtectedRoute>
            }
          />
          <Route path="admin/roadmap"
            element={
              <ProtectedRoute>
                <AdminRoadmap />
              </ProtectedRoute>
            }
          />
          <Route path="admin/daily-plan"
            element={
              <ProtectedRoute>
                <AdminDailyPlan />
              </ProtectedRoute>
            }
          />
          <Route path="admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={
            <>
              <Loader delay={300} />
              <NotFound />
            </>
          }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
