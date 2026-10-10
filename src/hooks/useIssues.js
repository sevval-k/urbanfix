import { useContext } from 'react'
import { IssuesContext } from '../context/issuesContext'

export function useIssues() {
  const context = useContext(IssuesContext)

  if (!context) {
    throw new Error('useIssues must be used inside <IssuesProvider>')
  }

  return context
}
