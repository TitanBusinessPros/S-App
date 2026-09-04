import { useEffect, useState } from 'react'
import { getInstallState, subscribeInstallState, triggerInstallPrompt } from './installPrompt'

/**
 * Exposes the install-prompt state captured by installPrompt.ts (see that
 * file for why the capture itself has to happen outside React, at module
 * scope, imported from main.tsx — not here).
 */
export function useInstallPrompt() {
  const [state, setState] = useState(getInstallState)

  useEffect(() => {
    return subscribeInstallState(() => setState(getInstallState()))
  }, [])

  return { ...state, promptInstall: triggerInstallPrompt }
}
