import React from "react";
import { Smile } from "lucide-react";

export default function TestIcon() {
  return (
    <>
    <div style={{ fontSize: '56px', color: 'red' }}>
      <Smile />
      <p>Lucide icon above ↑</p>
    </div>
    <div className="bg-red-500 text-white p-4 text-xl">
  If you see red, Tailwind works
</div>

    </>
  );
}
