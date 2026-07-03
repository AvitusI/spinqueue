import type { InputHTMLAttributes } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function Field({ label, hint, id, ...props }: FieldProps) {
  const fieldId = id ?? props.name
  return (
    <div>
      <label htmlFor={fieldId} className="label">
        {label}
      </label>
      <input id={fieldId} className="input" {...props} />
      {hint && <p className="mt-1 text-xs text-haze-400">{hint}</p>}
    </div>
  )
}
