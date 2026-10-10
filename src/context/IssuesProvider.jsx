import { useCallback, useEffect, useMemo, useState } from 'react'
import { IssuesContext } from './issuesContext'
import { SAMPLE_ISSUES } from '../data/sampleIssues'
import { loadIssues, saveIssues } from '../utils/storage'

export default function IssuesProvider({ children }) {
  // The lazy form useState(loadIssues) runs loadIssues once, on the first
  // render only, so storage is read once per visit, not on every render.
  const [initial] = useState(loadIssues)
  const [issues, setIssues] = useState(initial.issues)
  const [notice, setNotice] = useState(initial.notice) // load-time message
  const [storageError, setStorageError] = useState(null) // save-time problem

  // PERSIST: runs after the first render and after every change to issues.
  // This is the one place that writes to LocalStorage.
  useEffect(() => {
    const result = saveIssues(issues)
    setStorageError(result.ok ? null : result.message)
  }, [issues])

  const dismissNotice = useCallback(() => setNotice(null), [])

  // CREATE: the store assigns id, createdAt, and isSample, never the form.
  const addIssue = useCallback((data) => {
    const newIssue = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isSample: false,
    }
    setIssues((prev) => [newIssue, ...prev])
    return newIssue
  }, [])

  // UPDATE: merge the changes, but protect the fields users must not edit.
  const updateIssue = useCallback((id, changes) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? {
              ...issue,
              ...changes,
              id: issue.id,
              createdAt: issue.createdAt,
              isSample: issue.isSample,
            }
          : issue,
      ),
    )
  }, [])

  // DELETE: keep every issue except the one with this id.
  const deleteIssue = useCallback((id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id))
  }, [])

  // DATA MANAGEMENT
  // Remove only the demonstration records. The user's own reports stay.
  const removeSamples = useCallback(() => {
    setIssues((prev) => prev.filter((issue) => !issue.isSample))
  }, [])

  // Add back any sample that is currently missing. Samples that still
  // exist (even edited ones) are left alone, so nothing is duplicated.
  const restoreSamples = useCallback(() => {
    setIssues((prev) => {
      const existing = new Set(prev.map((issue) => issue.id))
      return [...prev, ...SAMPLE_ISSUES.filter((sample) => !existing.has(sample.id))]
    })
  }, [])

  const clearAll = useCallback(() => setIssues([]), [])

  const value = useMemo(
    () => ({
      issues,
      addIssue,
      updateIssue,
      deleteIssue,
      removeSamples,
      restoreSamples,
      clearAll,
      notice,
      dismissNotice,
      storageError,
    }),
    [
      issues, addIssue, updateIssue, deleteIssue,
      removeSamples, restoreSamples, clearAll,
      notice, dismissNotice, storageError,
    ],
  )

  return <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>
}