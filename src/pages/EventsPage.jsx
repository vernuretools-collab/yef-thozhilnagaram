import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  CalendarDays,
  Megaphone,
  Users,
} from "lucide-react"
import { ArrowRight } from "lucide-react"
import EventCard from "../components/EventCard"
import HostEventForm from "../components/HostEventForm"

const upcomingEvents = [
  {
    title: "Tamil Economy Networking Night",
    date: "15 June 2026",
    time: "6:30 PM IST",
    location: "Chennai, India",
    type: "In-person",
    description:
      "A focused networking evening for Tamil professionals, founders, and community leaders to connect and collaborate.",
  },
  {
    title: "Global Tamil Business Forum",
    date: "28 June 2026",
    time: "5:00 PM IST",
    location: "Online",
    type: "Online",
    description:
      "An online conversation on cross-border opportunities, partnerships, and community-led economic growth.",
  },
  {
    title: "YAAM City Connect Meetup",
    date: "10 July 2026",
    time: "7:00 PM IST",
    location: "Coimbatore, India",
    type: "Hybrid",
    description:
      "A community meetup bringing together members, mentors, and local organisations for meaningful exchange.",
  },
]

const pastEvents = [
  {
    title: "Professional Growth Summit",
    date: "18 March 2026",
    location: "Singapore",
    description:
      "A summit featuring Tamil leaders sharing insights on leadership, business, and career growth.",
  },
  {
    title: "YAAM Leadership Roundtable",
    date: "02 February 2026",
    location: "Online",
    description:
      "An invite-only session on community building, referrals, and stronger professional collaboration.",
  },
  {
    title: "Tamil Founders Meetup",
    date: "11 January 2026",
    location: "Kuala Lumpur",
    description:
      "An in-person gathering for entrepreneurs and founders exploring new opportunities and partnerships.",
  },
]

const tabs = [
  { id: "upcoming", label: "Upcoming Events" },
  { id: "past", label: "Past Events" },
  { id: "host", label: "Host an Event" },
  { id: "annual", label: "Annual Conference" },
]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="bg-[#E8ECF8] dark:bg-[#0f1628] min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDE8EB] dark:bg-[#3d0008]/50 text-[#D0021B] text-xs font-bold uppercase tracking-[0.12em]">
            <Megaphone size={14} /> Events
          </div>

          <h1
            className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] text-[#1A2B6B] dark:text-[#DDE3F5]"
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
          >
            Where Tamil minds meet to move the economy forward
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-700 dark:text-[#8899d4] leading-relaxed">
            Connect through upcoming gatherings, revisit past moments, host an
            event, or join the annual conference.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                activeTab === tab.id
                  ? "bg-[#1A2B6B] text-white border-[#1A2B6B] shadow-[0_2px_8px_rgba(26,43,107,0.18)]"
                  : "bg-white dark:bg-[#13192e] border-[#C5CCE8] dark:border-[#2a3460] text-[#6B7280] dark:text-[#8899d4] hover:border-[#1A2B6B] hover:text-[#1A2B6B] dark:hover:text-[#DDE3F5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {activeTab === "upcoming" && (
          <>
            <div className="flex items-center gap-2 mb-5 text-[#6B7280] dark:text-[#8899d4] font-medium">
              <Users size={16} />
              <span>Upcoming events</span>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.title} event={event} />
              ))}
            </div>
          </>
        )}

        {activeTab === "past" && (
          <>
            <div className="flex items-center gap-2 mb-5 text-[#6B7280] dark:text-[#8899d4] font-medium">
              <Users size={16} />
              <span>Past events</span>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <EventCard key={event.title} event={event} past />
              ))}
            </div>
          </>
        )}

        {activeTab === "host" && <HostEventForm />}

        {activeTab === "annual" && (
          <div className="rounded-[28px] bg-white dark:bg-[#13192e] border border-[#C5CCE8] dark:border-[#2a3460] p-8 sm:p-10 shadow-[0_8px_24px_rgba(26,43,107,0.08)] text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDE8EB] text-[#D0021B] text-xs font-bold uppercase tracking-[0.12em]">
              <CalendarDays size={14} /> Annual Conference
            </div>

            <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">
              YAAM Annual Conference
            </h2>

            <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-[#C9D2F2] leading-relaxed max-w-2xl mx-auto">
              A flagship gathering for Tamil professionals, entrepreneurs,
              mentors, and institutions to build partnerships, share insights,
              and shape the future together.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460] text-sm font-semibold text-[#1A2B6B] dark:text-[#8899d4]">
                Keynotes
              </span>
              <span className="px-4 py-2 rounded-full bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460] text-sm font-semibold text-[#1A2B6B] dark:text-[#8899d4]">
                Panels
              </span>
              <span className="px-4 py-2 rounded-full bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460] text-sm font-semibold text-[#1A2B6B] dark:text-[#8899d4]">
                Networking
              </span>
              <span className="px-4 py-2 rounded-full bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460] text-sm font-semibold text-[#1A2B6B] dark:text-[#8899d4]">
                Community showcases
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}