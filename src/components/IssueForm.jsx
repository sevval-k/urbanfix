import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
} from '../utils/constants'
import {
  formValuesToIssueData,
  validateIssue,
} from '../utils/validation'
import { inputClass } from '../utils/formStyles'
import FormField from './FormField'
import LocationFields from './LocationFields'

export default function IssueForm({
  initialValues,
  onSubmit,
  submitLabel,
  showStatus = false,
}) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(
    () => validateIssue(values),
    [values],
  )

  const getError = (name) =>
    submitted || touched[name] ? errors[name] : undefined

  const fieldProps = (name) => {
    const error = getError(name)

    return {
      id: name,
      name,
      value: values[name],
      onChange: (e) =>
        setValues((prev) => ({
          ...prev,
          [name]: e.target.value,
        })),
      onBlur: () =>
        setTouched((prev) => ({
          ...prev,
          [name]: true,
        })),
      'aria-invalid': Boolean(error),
      'aria-describedby': error
        ? `${name}-error`
        : `${name}-hint`,
      className: inputClass(Boolean(error)),
    }
  }

  const setLocation = (latitude, longitude) => {
    setValues((prev) => ({
      ...prev,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }))

    setTouched((prev) => ({
      ...prev,
      latitude: true,
      longitude: true,
    }))
  }

  const handleSubmit = (e) => {
  e.preventDefault()
  setSubmitted(true)

  const errorFields = Object.keys(errors)

  if (errorFields.length > 0) {
    const form = e.currentTarget
    const first = errorFields[0]

    const target =
      first === 'latitude' || first === 'longitude'
        ? form.querySelector('#location-section')
        : form.elements[first]

    target?.focus()
    return
  }

  onSubmit(formValuesToIssueData(values))
}

  const imageUrlIsValid =
    values.imageUrl.trim() !== '' && !errors.imageUrl

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <FormField
        id="title"
        label="Title"
        required
        error={getError('title')}
      >
        <input
          type="text"
          placeholder="e.g. Deep pothole on Main Street"
          {...fieldProps('title')}
        />
      </FormField>

      <FormField
        id="description"
        label="Description"
        required
        hint="What is wrong, and where exactly? (10 to 1000 characters)"
        error={getError('description')}
      >
        <textarea rows={4} {...fieldProps('description')} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="category"
          label="Category"
          required
          error={getError('category')}
        >
          <select {...fieldProps('category')}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="priority"
          label="Priority"
          required
          error={getError('priority')}
        >
          <select {...fieldProps('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {showStatus && (
        <FormField
          id="status"
          label="Status"
          required
          error={getError('status')}
        >
          <select {...fieldProps('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <LocationFields
        values={values}
        fieldProps={fieldProps}
        getError={getError}
        onLocationChange={setLocation}
      />

      <FormField
        id="imageUrl"
        label="Photo link (optional)"
        hint="A link to an image, starting with https://"
        error={getError('imageUrl')}
      >
        <input
          type="url"
          placeholder="https://example.com/photo.jpg"
          {...fieldProps('imageUrl')}
        />
      </FormField>

      {imageUrlIsValid && (
        <img
          src={values.imageUrl.trim()}
          alt="Preview of the linked photo"
          className="max-h-48 rounded-md border border-slate-200 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Link
          to="/issues"
          className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}