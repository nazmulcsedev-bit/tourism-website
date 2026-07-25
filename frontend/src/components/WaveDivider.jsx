// Signature motif: a river-wave line, echoing Bangladesh's rivers as section dividers
const WaveDivider = ({ color = '#F1E7D3', flip = false }) => (
  <svg
    className={`wave-divider ${flip ? 'rotate-180' : ''}`}
    viewBox="0 0 1200 40"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z"
      fill={color}
    />
  </svg>
);

export default WaveDivider;