import { lazy, Suspense } from 'react'
import { Route, Switch } from 'wouter'
import { Toaster } from 'sonner'
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from '@clerk/clerk-react'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LeadDiscovery = lazy(() => import('./pages/LeadDiscovery'))
const SavedLeads = lazy(() => import('./pages/SavedLeads'))
const SearchHistory = lazy(() => import('./pages/SearchHistory'))
const Pipeline = lazy(() => import('./pages/Pipeline'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const HighIntentSearch = lazy(() => import('./pages/HighIntentSearch'))
const LandingPage = lazy(() => import('./landing/LandingPage'))

function App() {
  return (
    <>
      <Switch>
        {/* Auth routes - Clerk's built-in UI */}
        <Route path="/sign-in">
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
          </div>
        </Route>
        <Route path="/sign-up">
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
          </div>
        </Route>

        {/* Landing page for signed out users at root */}
        <Route path="/">
          <SignedIn>
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </Layout>
          </SignedIn>
          <SignedOut>
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          </SignedOut>
        </Route>

        {/* Protected routes */}
        <Route>
          <SignedIn>
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Switch>
                  <Route path="/discover" component={LeadDiscovery} />
                  <Route path="/high-intent" component={HighIntentSearch} />
                  <Route path="/saved" component={SavedLeads} />
                  <Route path="/history" component={SearchHistory} />
                  <Route path="/pipeline" component={Pipeline} />
                  <Route path="/analytics" component={Analytics} />
                  <Route path="/settings" component={Settings} />
                  <Route>
                    <div className="flex items-center justify-center h-full">
                      <h1 className="text-2xl font-semibold text-muted-foreground">
                        Page not found
                      </h1>
                    </div>
                  </Route>
                </Switch>
              </Suspense>
            </Layout>
          </SignedIn>
          <SignedOut>
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          </SignedOut>
        </Route>
      </Switch>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
