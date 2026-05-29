interface SkeletonProps {
  className?: string
  width?: number | string
  height?: number | string
  rounded?: boolean
  style?: React.CSSProperties
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded,
  style = {},
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width !== undefined ? width : '100%',
        height: height !== undefined ? height : 16,
        borderRadius: rounded ? 'var(--r-full)' : 'var(--r-sm)',
        ...style,
      }}
    />
  )
}

export default Skeleton
