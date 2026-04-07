function StatsBar({ total, pending, resolved }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-5xl mb-8">
      <div className="surface p-4 border-l-4 border-indigo-500">
        <p className="muted text-xs font-bold uppercase tracking-wide">Total</p>
        <p className="text-3xl font-black">{total}</p>
      </div>
      <div className="surface p-4 border-l-4 border-yellow-400">
        <p className="muted text-xs font-bold uppercase tracking-wide">Pending</p>
        <p className="text-3xl font-black">{pending}</p>
      </div>
      <div className="surface p-4 border-l-4 border-green-500">
        <p className="muted text-xs font-bold uppercase tracking-wide">Resolved</p>
        <p className="text-3xl font-black">{resolved}</p>
      </div>
    </div>
  );
}
export default StatsBar;