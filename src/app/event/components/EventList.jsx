import EventCard from './EventCard';

const events = [
  {
    title: "EMPU SURYONO",
    organizer: "GPadaka Corp",
    description: "Workshop Web3 bersama mentor ternama",
    date: "Jul 11, 2025",
    location: "Basement Gd. 5, Universitas Amikom Yogyakarta",
    attendance: 1,
    capacity: 50,
    ended: true,
  },
  // Tambahkan event lain di sini jika perlu
];

const EventList = () => (
  <div className="flex flex-col gap-8">
    <div className="flex items-center gap-4 mb-6 bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-4">
      <input
        type="text"
        placeholder="Search events by title or description..."
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <select className="bg-transparent outline-none text-gray-700">
        <option>All Events</option>
        {/* Tambahkan filter lain jika perlu */}
      </select>
    </div>
    <div className="flex flex-wrap gap-8">
      {events.map((event, idx) => (
        <EventCard key={idx} {...event} />
      ))}
    </div>
  </div>
);

export default EventList; 