import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="130"
      height="40"
      {...props}
    >
      <text
        x="10"
        y="35"
        fontFamily="var(--font-headline), sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        MC
        <tspan fill="hsl(var(--primary))">QuickQuote</tspan>
      </text>
    </svg>
  );
}
