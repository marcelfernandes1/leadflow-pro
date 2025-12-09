import { Link, useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Search,
  Target,
  Bookmark,
  History,
  Kanban,
  BarChart3,
  Settings,
  Zap,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { UserButton, useUser } from '@clerk/clerk-react'
import { useSubscription } from '@/hooks/useSubscription'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
    >
      Skip to main content
    </a>
  )
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Discover', href: '/discover', icon: Search },
  { name: 'High-Intent', href: '/high-intent', icon: Target, premium: true },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'History', href: '/history', icon: History },
  { name: 'Pipeline', href: '/pipeline', icon: Kanban },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useUser()
  const { tier, isPro } = useSubscription()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [sidebarOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <TooltipProvider delayDuration={0}>
      <SkipToContent />
      <div className="flex h-screen overflow-hidden bg-background relative">
        {/* Ambient gradient mesh for glass effect */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cold/6 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-warm/5 rounded-full blur-3xl" />
        </div>
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? 72 : 240 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col lg:relative',
            'bg-elevated/80 backdrop-blur-xl border-r border-border/40',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
          style={{ transition: 'transform 0.2s ease' }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-base font-semibold tracking-tight whitespace-nowrap"
                    >
                      LeadFlow Pro
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>

            {/* Mobile close */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href
                const NavItem = (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )

                return isCollapsed ? (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>{NavItem}</Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link key={item.name} href={item.href}>
                    {NavItem}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User section with Clerk UserButton */}
          <div className="p-3 border-t border-border/50">
            <div className={cn(
              'flex items-center gap-3',
              isCollapsed ? 'justify-center' : 'px-2'
            )}>
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="text-sm text-muted-foreground">
                      {user?.firstName || 'Account'}
                    </span>
                    {isPro && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-2xs py-0 px-1.5',
                          tier === 'pro' && 'bg-primary/10 text-primary',
                          tier === 'agency' && 'bg-purple-400/10 text-purple-400',
                          tier === 'enterprise' && 'bg-amber-400/10 text-amber-400'
                        )}
                      >
                        {tier === 'pro' && <Sparkles className="h-2.5 w-2.5 mr-0.5" />}
                        {(tier === 'agency' || tier === 'enterprise') && <Crown className="h-2.5 w-2.5 mr-0.5" />}
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Collapse toggle */}
          <div className="p-3 border-t border-border/50 hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start gap-2 text-muted-foreground',
                isCollapsed && 'justify-center px-0'
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.div>
              {!isCollapsed && <span className="text-xs">Collapse</span>}
            </Button>
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile header */}
          <header className="flex items-center justify-between gap-4 h-16 px-4 bg-elevated/80 backdrop-blur-xl border-b border-border/40 lg:hidden">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold">LeadFlow Pro</span>
              </div>
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </header>

          {/* Page content */}
          <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
            <div className="max-w-7xl mx-auto px-6 py-8">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
