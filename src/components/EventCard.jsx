import React from "react"
import { CalendarDays, MapPin, Clock3 } from "lucide-react"

export default function EventCard({ event, past = false }) {
  return (
    <article className="h-full rounded-[28px] border border-[#C5CCE8] dark:border-[#2a3460] bg-white dark:bg-[#13192e] shadow-[0_8px_24px_rgba(26,43,107,0.08)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(26,43,107,0.14)] transition-all duration-200 flex flex-col">
      <div className="p-6 sm:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[#D0021B] text-xs font-bold uppercase tracking-[0.14em]">
          <CalendarDays size={14} />
          {past ? "Past Event" : "Upcoming Event"}
        </div>

        <h3 className="mt-4 text-2xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5] leading-tight">
          {event.title}
        </h3>

        <div className="mt-4 h-1 w-14 rounded-full bg-[#2F8BE6]" />

        <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-[#C9D2F2] flex-1">
          {event.description}
        </p>

        <div className="mt-6 space-y-3 text-sm text-[#374151] dark:text-[#c5cce8]">
          <div className="flex items-center gap-2">
            <Clock3 size={15} className="text-[#D0021B]" />
            <span>
              {event.date}
              {event.time ? ` • ${event.time}` : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#D0021B]" />
            <span>{event.location}</span>
          </div>

          {!past && event.type && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460] text-xs font-semibold text-[#1A2B6B] dark:text-[#8899d4] w-fit">
              {event.type}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}