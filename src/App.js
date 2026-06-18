import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Base from './pages/Base';

import Loader from './components/Loader';
import { LanguageProvider } from './components/LanguageContext';
import { hasAdminClaim } from './utils/adminAccess';

const Admin = React.lazy(() => import('./pages/Admin'));
const AdminDailyPlan = React.lazy(() => import('./pages/AdminDailyPlan'));
const AdminExpense = React.lazy(() => import('./pages/AdminExpense'));
const AdminProjects = React.lazy(() => import('./pages/AdminProjects'));
const AdminRoadmap = React.lazy(() => import('./pages/AdminRoadmap'));
const Login = React.lazy(() => import('./pages/Login'));
const NotFound = React.lazy(() => import('./components/NotFound'));

function App() {
  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let unsubscribe = () => { };
    let mounted = true;

    Promise.all([
      import('./configs/firebase'),
      import('firebase/auth'),
    ]).then(([{ auth }, { onAuthStateChanged }]) => {
      if (!mounted) {
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!mounted) {
          return;
        }

        setUser(currentUser);

        if (!currentUser) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        try {
          setIsAdmin(await hasAdminClaim(currentUser));
        } catch {
          setIsAdmin(false);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      });
    }).catch(() => {
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);


  React.useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, []);

  const ProtectedRoute = ({ adminOnly = true, children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (adminOnly && !isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <LanguageProvider>
      <Router>
        <React.Suspense fallback={<Loader delay={80} />}>
          <Routes>
            <Route path="/" element={
              <>
                <Loader delay={400} />
                <Base canAccessPrivatePages={isAdmin} />
              </>
            }
            />
            <Route path="/blog" element={
              <>
                <Loader delay={300} />
                <Base canAccessPrivatePages={isAdmin} initialPage="blog" />
              </>
            }
            />
            <Route path="/blog/:slug" element={
              <>
                <Loader delay={300} />
                <Base canAccessPrivatePages={isAdmin} initialPage="blog" />
              </>
            }
            />
            <Route path="/projects" element={
              <>
                <Loader delay={300} />
                <Base canAccessPrivatePages={isAdmin} initialPage="projects" />
              </>
            }
            />
            <Route path="/roadmap" element={
              <>
                <Loader delay={300} />
                <Base canAccessPrivatePages={isAdmin} initialPage="roadmap" />
              </>
            }
            />
            <Route path="/daily-plan" element={
              <ProtectedRoute>
                <>
                  <Loader delay={300} />
                  <Base canAccessPrivatePages={isAdmin} initialPage="dailyPlan" />
                </>
              </ProtectedRoute>
            }
            />
            <Route path="/market-analysis" element={
              <ProtectedRoute>
                <>
                  <Loader delay={300} />
                  <Base canAccessPrivatePages={isAdmin} initialPage="marketAnalysis" />
                </>
              </ProtectedRoute>
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
            <Route path="admin/expense"
              element={
                <ProtectedRoute adminOnly={false}>
                  <AdminExpense />
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
        </React.Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
