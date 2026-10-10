export default function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      ) : (
        hint && (
          <p
            id={`${id}-hint`}
            className="mt-1 text-xs text-slate-500"
          >
            {hint}
          </p>
        )
      )}
    </div>
  )
}