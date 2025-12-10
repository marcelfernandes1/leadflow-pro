import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KeyboardShortcutsHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ShortcutGroup {
  title: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['J'], description: 'Move selection down' },
      { keys: ['K'], description: 'Move selection up' },
      { keys: ['H'], description: 'Move to previous stage' },
      { keys: ['L'], description: 'Move to next stage' },
      { keys: ['Enter'], description: 'Open lead details' },
      { keys: ['Space'], description: 'Toggle selection' },
    ],
  },
  {
    title: 'Quick Actions',
    shortcuts: [
      { keys: ['M'], description: 'Move lead to stage' },
      { keys: ['T'], description: 'Add tag' },
      { keys: ['N'], description: 'Add note' },
      { keys: ['V'], description: 'Set deal value' },
      { keys: ['D'], description: 'Delete lead' },
      { keys: ['F'], description: 'Focus mode' },
    ],
  },
  {
    title: 'Global',
    shortcuts: [
      { keys: ['\u2318', 'K'], description: 'Command palette' },
      { keys: ['/'], description: 'Search leads' },
      { keys: ['?'], description: 'Show shortcuts' },
      { keys: ['Esc'], description: 'Close modal / Exit mode' },
    ],
  },
  {
    title: 'Bulk Operations',
    shortcuts: [
      { keys: ['\u2318', 'A'], description: 'Select all leads' },
      { keys: ['\u2318', 'Shift', 'A'], description: 'Deselect all' },
      { keys: ['\u2318', 'E'], description: 'Export selected' },
    ],
  },
]

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] as const }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-elevated/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Keyboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                    <p className="text-sm text-muted-foreground">
                      Navigate like a pro with these shortcuts
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Shortcuts Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                {shortcutGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface/50 transition-colors"
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <kbd
                                key={keyIndex}
                                className="min-w-[24px] h-6 px-2 flex items-center justify-center rounded-md bg-surface border border-border/50 text-xs font-medium text-muted-foreground"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border/30 bg-surface/30">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/50 text-2xs mx-1">?</kbd> anytime to show this help
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
