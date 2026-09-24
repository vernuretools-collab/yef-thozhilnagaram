import React from "react"
import { Building2, Mail, ArrowRight } from "lucide-react"

const eventTypes = ["Online", "Hybrid", "In-person"]

export default function HostEventForm() {
  return (
    <div className="grid lg:grid-cols-5 gap-6 items-start">
      <div className="lg:col-span-2 rounded-[28px] bg-white dark:bg-[#13192e] border border-[#C5CCE8] dark:border-[#2a3460] p-6 sm:p-8 shadow-[0_8px_24px_rgba(26,43,107,0.08)]">
        <div className="flex items-center gap-2 text-[#D0021B] text-xs font-bold uppercase tracking-[0.14em]">
          <Building2 size={14} /> Host an Event
        </div>

        <h2 className="mt-4 text-3xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">
          Bring YAAM to your City or Community
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-[#C9D2F2]">
          Got a conversation your community needs? We partner with
          professionals, institutions and organisations worldwide. Tell us your
          idea.
        </p>

        <div className="mt-6 rounded-2xl bg-[#FDE8EB] dark:bg-[#3d0008]/40 border border-[#F7C7D0] dark:border-[#4d1020] p-4">
          <p className="text-sm font-semibold text-[#1A2B6B] dark:text-[#DDE3F5]">
            Form fields include:
          </p>
          <p className="mt-2 text-sm text-gray-700 dark:text-[#C9D2F2] leading-relaxed">
            Name, Organisation/Institution, Email address, Location/city,
            Proposed format, Expected audience size, and Tell us about your
            idea.
          </p>
        </div>
      </div>

      <div className="lg:col-span-3 rounded-[28px] bg-white dark:bg-[#13192e] border border-[#C5CCE8] dark:border-[#2a3460] p-6 sm:p-8 shadow-[0_8px_24px_rgba(26,43,107,0.08)]">
        <div className="flex items-center gap-2 text-[#D0021B] text-xs font-bold uppercase tracking-[0.14em] mb-4">
          <Mail size={14} /> Form
        </div>

        <form className="grid sm:grid-cols-2 gap-4">
          <input className="input" placeholder="Name" />
          <input className="input" placeholder="Organisation / Institution" />
          <input className="input" type="email" placeholder="Email address" />
          <input className="input" placeholder="Location / city" />

          <select className="input sm:col-span-2">
            <option>Proposed format</option>
            {eventTypes.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input className="input sm:col-span-2" placeholder="Expected audience size" />
          <textarea
            className="input sm:col-span-2 min-h-[140px]"
            placeholder="Tell us about your idea"
          />

          <button
            type="button"
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white font-bold text-sm transition-all"
          >
            Submit idea <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}