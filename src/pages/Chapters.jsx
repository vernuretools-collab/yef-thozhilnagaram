import { useState } from 'react'
import { chapters } from '../data/chapters'
import ChapterCard from '../components/ChapterCard'
import SectionHeader from '../components/SectionHeader'
import { Building2 } from 'lucide-react'

const filters = [
  { value: 'all',    label: 'All Chapters'  },
  { value: 'open',   label: 'Category Open' },
  { value: 'online', label: 'Online'        },
  { value: 'hybrid', label: 'Hybrid'        },
]

export default function Chapters() {
  const [filter, setFilter] = useState('all')

  const filtered = chapters.filter(c => {
    if (filter === 'open')   return c.category_open
    if (filter === 'online') return c.mode === 'Online'
    if (filter === 'hybrid') return c.mode === 'Hybrid'
    return true
  })

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeader
        eyebrow="All Chapters"
        title="Find a chapter near you."
        subtitle="Yaam Economic Forum runs 2 active chapters across the region. Each chapter is exclusive — only one member per business category."
      />

      {/* ── Stats strip ── */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { label: 'Active Chapters',     value: chapters.length },
          { label: 'Exclusive Categories', value: '1 per chapter' },
          { label: 'Region',              value: 'Tamil Nadu'   },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-[#13192e] border border-[#C5CCE8] dark:border-[#2a3460] shadow-[0_1px_3px_rgba(26,43,107,0.07)]"
          >
            <div className="w-1.5 h-5 rounded-full bg-[#D0021B] flex-shrink-0" />
            <div>
              <p className="text-xs text-[#9AA3BF] font-medium">{label}</p>
              <p className="text-sm font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
              filter === f.value
                ? 'bg-[#1A2B6B] text-white border-[#1A2B6B] shadow-[0_2px_8px_rgba(26,43,107,0.25)]'
                : 'bg-white dark:bg-[#13192e] border-[#C5CCE8] dark:border-[#2a3460] text-[#6B7280] dark:text-[#8899d4] hover:border-[#1A2B6B] hover:text-[#1A2B6B] dark:hover:text-[#DDE3F5] hover:bg-[#E8ECF8] dark:hover:bg-[#1c2340]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Chapter grid ── */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => <ChapterCard key={c.slug} chapter={c} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#13192e] rounded-2xl border border-[#C5CCE8] dark:border-[#2a3460]">
          <div className="w-14 h-14 rounded-2xl bg-[#E8ECF8] dark:bg-[#1c2340] flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-[#1A2B6B] dark:text-[#8899d4] opacity-40" />
          </div>
          <p className="font-semibold text-[#6B7280] dark:text-[#8899d4]">
            No chapters match this filter.
          </p>
          <p className="text-xs text-[#9AA3BF] mt-1">
            Try selecting a different filter above.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="mt-4 text-sm font-semibold text-[#D0021B] hover:underline"
          >
            Show all chapters
          </button>
        </div>
      )}
    </section>
  )
}