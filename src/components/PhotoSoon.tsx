/** Placeholder for a menu item that has no usable photo yet: a flat pink tile. The card around it shows the item name. */
export default function PhotoSoon({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-pink p-4 text-center ${className}`}>
      <span className="font-display text-xl leading-tight sm:text-2xl">Photo<br />coming soon</span>
    </div>
  );
}
