"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { initialsOf } from "@/lib/format";

const gradients = [
  "from-brand-400 to-brand-600",
  "from-violet-400 to-violet-600",
  "from-sky-400 to-sky-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
];

function pick(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % gradients.length;
  return gradients[h];
}

export default function Avatar({ src, name = "", size = 40, className, ring }) {
  const [err, setErr] = useState(false);
  const showImg = src && !err;
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden flex items-center justify-center",
        ring && "ring-2 ring-brand-200 ring-offset-2 ring-offset-white",
        className
      )}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setErr(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full bg-gradient-to-br text-white font-bold flex items-center justify-center",
            pick(name)
          )}
          style={{ fontSize: size * 0.38 }}
        >
          {initialsOf(name)}
        </div>
      )}
    </div>
  );
}
