/**
 * A photograph set like a print: it wipes open (clip-path) as it enters the viewport, the image drifts inside its frame as you
 * scroll (inner parallax), and a hover zooms it slightly. All CSS (.ph-* in globals.css), so no JavaScript per photo. The frame
 * carries data-cursor="View" for the custom cursor. Plain <img>: these are shipped 1600px webp files, lazy loaded.
 */
export default function Photo({
  src,
  alt,
  ratio,
  caption,
  className = "",
  captionClass = "",
}: {
  src: string;
  alt: string;
  /** width / height of the frame, e.g. 1.6 */
  ratio: number;
  caption?: React.ReactNode;
  className?: string;
  captionClass?: string;
}) {
  return (
    <figure className={className}>
      <div className="ph-frame ph-reveal" data-cursor="View" style={{ aspectRatio: String(ratio) }}>
        <div className="ph-par">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" decoding="async" width={1600} height={Math.round(1600 / ratio)} />
        </div>
      </div>
      {caption && <figcaption className={`caption-i mt-3 ${captionClass}`}>{caption}</figcaption>}
    </figure>
  );
}
