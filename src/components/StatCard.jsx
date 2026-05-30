export default function StatCard({ label, value, sub }) {
  return (
    <div className="border border-gray-800 rounded-lg p-5 bg-gray-900/50">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}
