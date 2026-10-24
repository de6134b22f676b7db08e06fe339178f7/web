/**
 * Route transition (DESIGN.md §6.3): every navigation re-mounts this wrapper, which enters with a 420ms opacity fade
 * (CSS `.page-enter`, off under reduced motion). No exit animation: navigation is never blocked.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
