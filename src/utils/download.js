// Saves text as a file on the user's computer, entirely in the browser:
// no server is involved. A Blob is an in-memory file, and an object URL
// is a temporary address that points to it.
export function downloadTextFile(filename, text, mimeType) {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  // Free the memory. The short delay avoids cancelling the download in
  // browsers that start it asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}