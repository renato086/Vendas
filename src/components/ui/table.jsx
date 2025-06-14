export function Table({ children }) { return <table className="min-w-full divide-y divide-gray-200">{children}</table>; }
export function TableHeader({ children }) { return <thead>{children}</thead>; }
export function TableBody({ children }) { return <tbody>{children}</tbody>; }
export function TableRow({ children, className='' }) { return <tr className={className}>{children}</tr>; }
export function TableHead({ children }) { return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>; }
export function TableCell({ children, className='' }) { return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>; }
