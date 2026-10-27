import BoardWindow from "./BoardWindow";

type Shot = { name: string; image: string | null };

/**
 * Shell of one menu-board category: title, the photo window (BoardWindow, the only client part) and the price rows
 * (server-rendered, passed in as children). --active (set on the board by BoardWindow) picks which shot is visible;
 * see .board-shot in globals.css.
 */
export default function MenuBoard({ title, blurb, shots, children }: { title: string; blurb?: string; shots: Shot[]; children: React.ReactNode }) {
  return (
    <div className="board grid gap-8 lg:grid-cols-[21rem_1fr] lg:gap-14" style={{ "--active": 0 } as React.CSSProperties}>
      <aside>
        <h3 className="font-display text-[2.6rem] leading-[1.05] text-pink sm:text-5xl">{title}</h3>
        {blurb && <p className="mt-3 max-w-xs text-lg">{blurb}</p>}
        <BoardWindow shots={shots} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
