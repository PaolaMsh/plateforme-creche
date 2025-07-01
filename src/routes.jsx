import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Composant de chargement
const Loading = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #3f51b5',
                borderRight: '5px solid #3f51b5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
            }} />
            <p style={{
                marginTop: '20px',
                color: '#3f51b5',
                fontFamily: 'Arial, sans-serif',
                fontSize: '1.2rem',
                fontWeight: '500'
            }}>Chargement en cours...</p>
        </div>
    </div>
);

// Lazy-loaded layouts
const DefaultLayout = lazy(() => import('./layouts/DefaultLayout'));
const ProtectedRoute = lazy(() => import('./layouts/ProtectedRoute'));

// Lazy-loaded pages
const Accueil = lazy(() => import('./pages/Accueil'));
const CGU = lazy(() => import('./pages/CGU'));
const Contact = lazy(() => import('./pages/Contact'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const CrecheGarderie = lazy(() => import('./pages/Creche_Garderie'));
const Support = lazy(() => import('./pages/Support'));
const SignUpForm = lazy(() => import('./pages/inscription'));
const LoginPage = lazy(() => import('./pages/connexion'));
const Abonnement = lazy(() => import('./pages/Abonnement'));
const Suivredetails = lazy(() => import('./pages/suivredetails'));
const Crechedetails = lazy(() => import('./pages/crechedetails'));
const Inscrireenfant = lazy(() => import('./pages/inscrireenfant'));
const Nounourapide = lazy(() => import('./pages/nounourapide'));
const Profil = lazy(() => import('./pages/profil'));
const AddNusery = lazy(() => import('./pages/ajoutcreche'));
const Detailsenfant = lazy(() => import('./pages/detailsenfant'));

const AppRoutes = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirection côté client depuis racine
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            navigate('/accueil', { replace: true });
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/accueil" replace />} />
            <Route path="/auth-register" element={<Suspense fallback={<Loading />}><SignUpForm /></Suspense>} />
            <Route path="/auth-login" element={<Suspense fallback={<Loading />}><LoginPage /></Suspense>} />
            <Route path="/accueil" element={<Suspense fallback={<Loading />}><DefaultLayout><Accueil /></DefaultLayout></Suspense>} />
            <Route path="/creche-garderie" element={<Suspense fallback={<Loading />}><DefaultLayout><CrecheGarderie /></DefaultLayout></Suspense>} />
            <Route path="/support" element={<Suspense fallback={<Loading />}><DefaultLayout><Support /></DefaultLayout></Suspense>} />
            <Route path="/crechedetails/:id" element={<Suspense fallback={<Loading />}><DefaultLayout><Crechedetails /></DefaultLayout></Suspense>} />
            <Route path="/mentions-legales" element={<Suspense fallback={<Loading />}><DefaultLayout><MentionsLegales /></DefaultLayout></Suspense>} />
            <Route path="/politique-de-confidentialite" element={<Suspense fallback={<Loading />}><DefaultLayout><PolitiqueConfidentialite /></DefaultLayout></Suspense>} />
            <Route path="/conditions-generales" element={<Suspense fallback={<Loading />}><DefaultLayout><CGU /></DefaultLayout></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<Loading />}><DefaultLayout><Contact /></DefaultLayout></Suspense>} />

            {/* Routes protégées */}
            <Route element={<Suspense fallback={<Loading />}><ProtectedRoute /></Suspense>}>
                <Route path="/mes-abonnements" element={<Suspense fallback={<Loading />}><DefaultLayout><Abonnement /></DefaultLayout></Suspense>} />
                <Route path="/detailsenfant" element={<Suspense fallback={<Loading />}><DefaultLayout><Detailsenfant /></DefaultLayout></Suspense>} />
                <Route path="/profil" element={<Suspense fallback={<Loading />}><DefaultLayout><Profil /></DefaultLayout></Suspense>} />
                <Route path="/ajoutcreche" element={<Suspense fallback={<Loading />}><DefaultLayout><AddNusery /></DefaultLayout></Suspense>} />
                <Route path="/suivredetails/:id" element={<Suspense fallback={<Loading />}><DefaultLayout><Suivredetails /></DefaultLayout></Suspense>} />
                <Route path="/inscrireenfant/:id" element={<Suspense fallback={<Loading />}><DefaultLayout><Inscrireenfant /></DefaultLayout></Suspense>} />
                <Route path="/nounourapide" element={<Suspense fallback={<Loading />}><DefaultLayout><Nounourapide /></DefaultLayout></Suspense>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;