/**
 * Google Maps embed via iframe (no API key required — uses the public
 * `output=embed` query URL). Pass the campus address.
 */
export function MapEmbed({ address, title }: { address: string; title: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-card">
      <iframe
        title={title}
        src={src}
        width="100%"
        height="260"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0 }}
        allowFullScreen
      />
    </div>
  );
}
