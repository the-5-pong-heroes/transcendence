import React from "react";
import { Link } from "react-router-dom";

import { useAppContext } from "@hooks";

interface LinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export const CustomLink: React.FC<LinkProps> = ({ to, className, children }) => {
  const { isNavigatingRef } = useAppContext();

  const onClick = (): void => {
    isNavigatingRef.current = true;
    setTimeout(() => (isNavigatingRef.current = false), 2000);
  };

  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};
