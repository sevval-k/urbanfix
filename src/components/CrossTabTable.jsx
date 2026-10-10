function percent(part, whole) {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : '–'
}

export default function CrossTabTable({
  title,
  rowHeader,
  data,
  showResolvedShare = false,
}) {
  const { rows, columns, colTotals, total } = data

  const head = 'px-2 py-2 text-right font-semibold'
  const cell = 'px-2 py-2 text-right tabular-nums'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-800">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" className="py-2 pr-3 font-semibold">
                {rowHeader}
              </th>

              {columns.map((column) => (
                <th key={column} scope="col" className={head}>
                  {column}
                </th>
              ))}

              <th scope="col" className={head}>
                Total
              </th>

              {showResolvedShare && (
                <th scope="col" className={head}>
                  Resolved
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="py-2 pr-3 font-medium text-slate-800">
                  {row.label}
                </th>

                {columns.map((column) => (
                  <td
                    key={column}
                    className={`${cell} ${
                      row.counts[column] === 0
                        ? 'text-slate-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {row.counts[column]}
                  </td>
                ))}

                <td className={`${cell} font-semibold text-slate-800`}>
                  {row.total}
                </td>

                {showResolvedShare && (
                  <td className={`${cell} text-slate-700`}>
                    {percent(row.counts.Resolved, row.total)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-slate-200 font-semibold text-slate-800">
              <th scope="row" className="py-2 pr-3">
                All categories
              </th>

              {columns.map((column) => (
                <td key={column} className={cell}>
                  {colTotals[column]}
                </td>
              ))}

              <td className={cell}>{total}</td>

              {showResolvedShare && (
                <td className={cell}>
                  {percent(colTotals.Resolved, total)}
                </td>
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}