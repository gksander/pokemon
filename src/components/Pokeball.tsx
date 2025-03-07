import * as React from "react";
import { type SVGProps } from "react";

type PokeballProps = SVGProps<SVGSVGElement>;

export function Pokeball(props: PokeballProps) {
  return (
    <svg
      width="100%"
      viewBox="0 0 326 327"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M223.569 178H325.732C318.393 261.507 248.278 327 162.866 327C77.4536 327 7.33826 261.507 0 178H101.163C107.892 205.552 132.741 226 162.366 226C191.991 226 216.84 205.552 223.569 178ZM223.569 148H325.641C317.833 64.9712 247.937 0 162.866 0C77.7949 0 7.89874 64.9712 0.0909576 148H101.163C107.892 120.448 132.741 100 162.366 100C191.991 100 216.84 120.448 223.569 148Z"
        className="fill-current"
      />
      <circle cx="162.366" cy="163" r="38" className="fill-current" />
    </svg>
  );
}
