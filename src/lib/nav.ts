import { usePathname, useRouter as useExpoRouter } from 'expo-router';
import { useMemo, useRef } from 'react';

/** After one navigation starts, further push / navigate calls are ignored for this long. */
const LOCK_MS = 450;
/** Screens that must only ever exist once in the stack. */
const SINGLE = ['/menu', '/login'];

let lockedUntil = 0;

const pathOf = (href: unknown): string => {
  const raw = typeof href === 'string' ? href : ((href as { pathname?: string })?.pathname ?? '');
  return raw.split('?')[0].split('#')[0];
};

/**
 * `useRouter` with a tap guard. push / navigate / replace are ignored while another navigation was started in the last
 * 450 ms, and /menu and /login are never opened on top of themselves — so double-tapping (or hammering) a button
 * can't stack duplicate screens. back / dismiss are untouched.
 */
export function useRouter() {
  const router = useExpoRouter();
  const pathname = usePathname();
  const current = useRef(pathname);
  current.current = pathname;

  return useMemo(() => {
    const guard =
      <A extends unknown[]>(fn: (...args: A) => void) =>
      (...args: A) => {
        const now = Date.now();
        if (now < lockedUntil) return;
        const target = pathOf(args[0]);
        if (SINGLE.includes(target) && current.current === target) return;
        lockedUntil = now + LOCK_MS;
        fn(...args);
      };
    return {
      ...router,
      push: guard(router.push as (...a: never[]) => void) as typeof router.push,
      navigate: guard(router.navigate as (...a: never[]) => void) as typeof router.navigate,
      replace: guard(router.replace as (...a: never[]) => void) as typeof router.replace,
    };
  }, [router]);
}
