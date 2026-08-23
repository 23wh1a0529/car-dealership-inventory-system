function Logo({ size = "md", showWordmark = true }) {
  const dims = size === "sm" ? 28 : size === "lg" ? 44 : 34;

  return (
    <div className="flex items-center gap-2">
      <svg width={dims} height={dims} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#1C8C82" />
        <path
          d="M12 28c0-2 1.5-3.5 3-6l2-3.5c1-1.7 2-2.5 4-2.5h6c2 0 3 0.8 4 2.5l2 3.5c1.5 2.5 3 4 3 6"
          stroke="#FBF7EF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M11 28h26"
          stroke="#FBF7EF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="17" cy="31.5" r="2.4" fill="#3FC7B9" />
        <circle cx="31" cy="31.5" r="2.4" fill="#3FC7B9" />
        <path
          d="M14 34.5h20"
          stroke="#C99A2E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-teal font-semibold tracking-tight" style={{ fontSize: dims * 0.55 }}>
          AutoLedger
        </span>
      )}
    </div>
  );
}

export default Logo;
