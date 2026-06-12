export default function Spinner({ size = 'md', className = '' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
  return (
    <div
      className={`${s} rounded-full border-2 border-cream-300 border-t-atlas-dark animate-spin ${className}`}
    />
  )
}
