function Bloom({ cx, cy, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-7"
          rx="4.2"
          ry="7"
          transform={`rotate(${angle})`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
      <circle r="1.6" fill="currentColor" stroke="none" />
    </g>
  )
}

function FloralCorner({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4 C 40 10, 60 30, 66 60 C 72 90, 90 110, 130 118 C 155 123, 175 132, 190 150"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M20 8 C 30 26, 34 40, 30 52"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M70 62 C 84 66, 96 78, 98 92"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <Bloom cx={40} cy={26} scale={1} />
      <Bloom cx={84} cy={92} scale={0.85} />
      <Bloom cx={142} cy={124} scale={0.7} />
    </svg>
  )
}

export default FloralCorner
