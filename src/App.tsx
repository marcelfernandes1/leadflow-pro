import { Route, Switch } from 'wouter'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LeadDiscovery from './pages/LeadDiscovery'
import Pipeline from './pages/Pipeline'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/discover" component={LeadDiscovery} />
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
      </Layout>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
