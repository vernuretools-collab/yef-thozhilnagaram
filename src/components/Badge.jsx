export default function Badge({ children, color = 'red' }) {
  const colors = {
    red:   'bg-[#FDE8EB] text-[#D0021B] dark:bg-[#3d0008] dark:text-[#f87171]',
    navy:  'bg-[#E8ECF8] text-[#1A2B6B] dark:bg-[#1c2340] dark:text-[#8899d4]',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    gray:  'bg-[#F5F6FA] text-[#6B7280] dark:bg-[#1c2340] dark:text-[#8899d4] border border-[#C5CCE8] dark:border-[#2a3460]',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  )
}