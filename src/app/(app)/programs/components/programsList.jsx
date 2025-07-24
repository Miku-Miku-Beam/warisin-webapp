import ProgramCard from './programsCard';

const ProgramsList = ({ events }) => (
  <div className="flex flex-col gap-8">
    <div className="flex items-center gap-4 mb-6 bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-4">
      <input
        type="text"
        placeholder="Search events by title or description..."
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <select className="bg-transparent outline-none text-gray-700">
        <option>All Program</option>
        {/* Tambahkan filter lain jika perlu */}
      </select>
    </div>
    <div className="flex flex-wrap gap-8">
      {events && events.length > 0 ? (
        events.map((event) => (
          <ProgramCard key={event.id} {...event} />
        ))
      ) : (
        <div className="text-gray-500">No events found.</div>
      )}
    </div>
  </div>
);

export default ProgramsList; 