import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'


// Composant de chargement
const Loading = () => <div style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement en cours...</div>

// Lazy-loaded components
const DefaultLayout = lazy(() => import('./layouts/DefaultLayout'))
const ProtectedRoute = lazy(() => import('./layouts/ProtectedRoute'))

// Lazy-loaded pages
const Accueil = lazy(() => import('./pages/Accueil'));
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
    const navigate = useNavigate()

    useEffect(() => {
        // Redirection client-side au cas où la redirection serveur échoue
        if (window.location.pathname === '/' ||
            window.location.pathname === '/index.html') {
            navigate('/accueil', { replace: true })
        }
    }, [navigate])

    return (
        <Routes>
            {/* Route racine - ne sera jamais atteinte grâce à la redirection */}
            <Route path="/" element={null} />
            <Route
                path="/auth-register"
                element={
                    <Suspense fallback={<Loading />}>
                        <SignUpForm />
                    </Suspense>
                }
            />
            <Route
                path="/auth-login"
                element={
                    <Suspense fallback={<Loading />}>
                        <LoginPage />
                    </Suspense>
                }
            />
            {/* Redirection explicite */}
            <Route path="/" element={<RootRedirect />} />
            {/* <Route
            path="/"
            element={<Navigate to="/accueil" replace />}
        /> */}
            <Route
                path="/accueil"
                element={
                    <Suspense fallback={<Loading />}>
                        <DefaultLayout>
                            <Accueil />
                        </DefaultLayout>
                    </Suspense>
                }
            />
            <Route
                path="/creche-garderie"
                element={
                    <Suspense fallback={<Loading />}>
                        <DefaultLayout>
                            <CrecheGarderie />
                        </DefaultLayout>
                    </Suspense>
                }
            />
            <Route
                path="/support"
                element={
                    <Suspense fallback={<Loading />}>
                        <DefaultLayout>
                            <Support />
                        </DefaultLayout>
                    </Suspense>
                }
            />
            <Route
                path="/crechedetails/:id"
                element={
                    <Suspense fallback={<Loading />}>
                        <DefaultLayout>
                            <Crechedetails />
                        </DefaultLayout>
                    </Suspense>
                }
            />
            <Route
                path="/profil"
                element={
                    <Suspense fallback={<Loading />}>
                        <DefaultLayout>
                            <Profil />
                        </DefaultLayout>
                    </Suspense>
                }
            />
            <Route
                path="/detailsenfant"
                element={
                    <Suspense fallback={<Loading />}>
                        <DefaultLayout>
                            <Detailsenfant />
                        </DefaultLayout>
                    </Suspense>
                }
            />

            {/* Routes protégées */}
            <Route
                element={
                    <Suspense fallback={<Loading />}>
                        <ProtectedRoute />
                    </Suspense>
                }
            >
                <Route
                    path="/mes-abonnements"
                    element={
                        <Suspense fallback={<Loading />}>
                            <DefaultLayout>
                                <Abonnement />
                            </DefaultLayout>
                        </Suspense>
                    }
                />
                <Route
                    path="/ajoutcreche"
                    element={
                        <Suspense fallback={<Loading />}>
                            <DefaultLayout>
                                <AddNusery />
                            </DefaultLayout>
                        </Suspense>
                    }
                />
                <Route
                    path="/suivredetails/:id"
                    element={
                        <Suspense fallback={<Loading />}>
                            <DefaultLayout>
                                <Suivredetails />
                            </DefaultLayout>
                        </Suspense>
                    }
                />
                <Route
                    path="/inscrireenfant/:id"
                    element={
                        <Suspense fallback={<Loading />}>
                            <DefaultLayout>
                                <Inscrireenfant />
                            </DefaultLayout>
                        </Suspense>
                    }
                />
                <Route
                    path="/nounourapide"
                    element={
                        <Suspense fallback={<Loading />}>
                            <DefaultLayout>
                                <Nounourapide />
                            </DefaultLayout>
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    )}

    export default AppRoutes;
