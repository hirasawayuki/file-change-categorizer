import { ReactNode, useContext, useEffect } from 'react';
import { match } from 'path-to-regexp';

import { RouterContext } from '@/providers/provider';

type RouteProps = {
  path: string;
  element: ReactNode;
};

export const Route = ({ path, element }: RouteProps) => {
  const { currentPath, setParams } = useContext(RouterContext);

  useEffect(() => {
    const result = match(path)(currentPath);
    if (result) {
      setParams(result.params);
    }
  }, [path, element, setParams, currentPath]);

  const result = match(path)(currentPath);
  if (!result) return null;

  return <>{element}</>;
};

type NavLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
}

export const NavLink = ({ to, children, className = "" }: NavLinkProps) => {
  const { setCurrentPath } = useContext(RouterContext);

  return (
    <button className={className} onClick={() => setCurrentPath(to)} >
      {children}
    </button>
  );
};
