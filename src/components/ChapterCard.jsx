import { CalendarDays, Clock3, MapPin, TrendingUp } from 'lucide-react'
import Badge from './Badge'

export default function ChapterCard({ chapter }) {
  return (
    <article className="bg-white dark:bg-[#13192e] border border-[#C5CCE8] dark:border-[#2a3460] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(26,43,107,0.08)] hover:shadow-[0_6px_20px_rgba(26,43,107,0.13)] hover:-translate-y-1 transition-all duration-200 flex flex-col">

      {/* ── Header — navy gradient ── */}
      <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-[#1A2B6B] to-[#111E4F] border-b border-[#2a3460] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-[#D0021B]/10 pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative">
          <Badge color="red">{chapter.mode}</Badge>
          <Badge color={chapter.category_open ? 'green' : 'gray'}>
            {chapter.category_open ? 'Category open' : 'Category closed'}
          </Badge>
        </div>

        <h3
          className="text-xl font-bold text-white leading-tight mt-1 relative"
          style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
        >
          {chapter.name}
        </h3>
        <p className="text-white text-xs mt-1 font-medium relative">
          Yaam Economic Forum
        </p>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">

        {/* Business passed */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FDE8EB] dark:bg-[#3d0008]/0">
          <TrendingUp size={13} className="text-[#D0021B] flex-shrink-0" />
          <p className="text-sm font-bold">
            {chapter.business} business passed this year
          </p>
        </div>

        {/* Meta list */}
        <ul className="space-y-2 text-sm text-gray-700 font-bold dark:text-[#8899d4]">
          <li className="flex items-center gap-2">
            <CalendarDays size={13} className="text-[#1A2B6B] dark:text-[#8899d4] flex-shrink-0" />
            {chapter.day}
          </li>
          <li className="flex items-center gap-2">
            <Clock3 size={13} className="text-[#1A2B6B] dark:text-[#8899d4] flex-shrink-0" />
            {chapter.time}
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={13} className="text-[#1A2B6B] dark:text-[#8899d4] flex-shrink-0" />
            {chapter.venue}
          </li>
        </ul>

        {/* CTA — external link */}
        <div className="mt-auto pt-3">
          <a
            href={chapter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-[#1A2B6B] dark:border-[#4a5a9a] text-[#1A2B6B] dark:text-[#8899d4] text-sm font-bold hover:bg-[#1A2B6B] hover:text-white dark:hover:bg-[#1A2B6B] dark:hover:text-white transition-all duration-150"
          >
            View Chapter →
          </a>
        </div>
      </div>
    </article>
  )
}