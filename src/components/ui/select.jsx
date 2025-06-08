export function Select({ children, className='', ...rest }) { return <select {...rest} className={className}>{children}</select>; }
export function SelectItem({ value, children }) { return <option value={value}>{children}</option>; }
