const statusColors = {
  SUCCESS: "text-green-400 bg-green-400/10",
  FAILED: "text-red-400 bg-red-400/10",
  PENDING: "text-yellow-400 bg-yellow-400/10",
  REVERSED: "text-gray-400 bg-gray-400/10",
};

const typeColors = {
  DEPOSIT: "text-green-300",
  WITHDRAWAL: "text-red-300",
  TRANSFER_OUT: "text-orange-300",
  TRANSFER_IN: "text-blue-300",
};

export default function TransactionTable({ transactions }) {
  if (!transactions?.length) {
    return (
      <div className="text-center text-gray-600 py-12 border border-gray-800 rounded-lg">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/80">
            <th className="text-left px-4 py-3 text-gray-500 font-normal">
              Reference
            </th>
            <th className="text-left px-4 py-3 text-gray-500 font-normal">
              Type
            </th>
            <th className="text-left px-4 py-3 text-gray-500 font-normal">
              Amount
            </th>
            <th className="text-left px-4 py-3 text-gray-500 font-normal">
              Status
            </th>
            <th className="text-left px-4 py-3 text-gray-500 font-normal">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              className="border-b border-gray-800/50 hover:bg-gray-800/30"
            >
              <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                {txn.referenceId}
              </td>
              <td
                className={`px-4 py-3 font-medium ${typeColors[txn.type] || "text-gray-300"}`}
              >
                {txn.type}
              </td>
              <td className="px-4 py-3 text-white font-medium">
                ₹
                {Number(txn.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${statusColors[txn.status] || ""}`}
                >
                  {txn.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
