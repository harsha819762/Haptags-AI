const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ImageIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.1 0L5 19" />
    </svg>
  );
}

export function VideoIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M17 9.5l4-2.5v10l-4-2.5" />
    </svg>
  );
}

export function AudioIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12v1M8 9v7M12 5v15M16 9v7M20 12v1" />
    </svg>
  );
}

export function CharacterIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.87 3.13-6 7-6s7 2.13 7 6" />
    </svg>
  );
}

export function CameraIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}

export function StoryboardIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6" width="6" height="6" rx="1" />
      <rect x="9.5" y="6" width="6" height="6" rx="1" />
      <rect x="16.5" y="6" width="5" height="6" rx="1" />
      <path d="M4 15.5h16" />
    </svg>
  );
}

export function UpscaleIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
    </svg>
  );
}

export function RouterIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="5" cy="19" r="1.8" />
      <circle cx="19" cy="19" r="1.8" />
      <path d="M12 6.8v6M12 12.8L6 17.5M12 12.8l6 4.7" />
    </svg>
  );
}
