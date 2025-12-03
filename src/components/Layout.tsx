import { Link, useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Search,
  Kanban,
  BarChart3,
  Settings,
  Zap,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Discover', href: '/discover', icon: Search },
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

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [sidebarOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SkipToContent />
      <div className="flex h-screen overflow-hidden bg-background gradient-mesh noise">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-obsidian-void/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          variants={sidebarVariants}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col lg:relative',
            'glass-prominent border-r border-white/5',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
          style={{ transition: 'transform 0.3s ease' }}
          aria-label="Main navigation"
          role="navigation"
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between px-4 py-5 h-[72px]">
            <Link href="/">
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-violet shadow-lg shadow-violet/30">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 rounded-xl gradient-violet opacity-30 blur-lg -z-10" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hidden lg:block"
                    >
                      <span className="text-lg font-display font-bold text-gradient-primary">
                        LeadFlow
                      </span>
                      <span className="text-lg font-display font-bold text-foreground ml-1">
                        Pro
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </Button>

            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </motion.div>
            </Button>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-6">
            <nav className="space-y-1.5" aria-label="Main menu">
              {navigation.map((item, index) => {
                const isActive = location === item.href
                const NavContent = (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                      isCollapsed && 'justify-center px-0'
                    )}
                    onClick={() => setSidebarOpen(false)}
                    role="link"
                    tabIndex={0}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl gradient-violet"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Glow effect for active */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl gradient-violet opacity-40 blur-xl -z-10" />
                    )}

                    <item.icon className={cn(
                      'relative w-5 h-5 transition-transform',
                      isActive && 'text-white'
                    )} aria-hidden="true" />

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative whitespace-nowrap"
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
                      <Link href={item.href}>{NavContent}</Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link key={item.name} href={item.href}>
                    {NavContent}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Divider */}
          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* User section */}
          <div className="p-4">
            <div className={cn(
              'flex items-center gap-3 px-2 py-2 rounded-xl transition-colors hover:bg-white/5',
              isCollapsed && 'justify-center px-0'
            )}>
              <div className="relative">
                <Avatar className="w-9 h-9 border-2 border-violet/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet to-cyan text-white text-sm font-medium">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-obsidian-elevated" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium truncate">User</p>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="glass" className="text-2xs px-1.5 py-0">
                        <Sparkles className="w-2.5 h-2.5 mr-1" />
                        Free
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile header */}
          <header className="flex items-center gap-4 px-4 py-3 glass border-b border-white/5 lg:hidden" role="banner">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-violet shadow-lg shadow-violet/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-gradient-primary">
                LeadFlow
              </span>
              <span className="text-lg font-display font-bold text-foreground">
                Pro
              </span>
            </div>
          </header>

          {/* Page content */}
          <main
            id="main-content"
            className="flex-1 overflow-auto"
            role="main"
            tabIndex={-1}
          >
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
