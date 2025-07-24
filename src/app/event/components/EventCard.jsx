const EventCard = ({
  title,
  organizer,
  description,
  date,
  location,
  attendance,
  capacity,
  ended,
}) => (
  <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ended ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>
        {ended ? 'Ended' : 'Active'}
      </span>
      <span className="flex items-center gap-1 text-gray-500 text-xs">
        <svg width="16" height="16" fill="none"><path d="M8 8a2 2 0 100-4 2 2 0 000 4zM8 9c-2.21 0-4 1.12-4 2.5V13h8v-1.5C12 10.12 10.21 9 8 9z" fill="currentColor"/></svg>
        {attendance}/{capacity}
      </span>
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-semibold">Organizer:</span> {organizer}
      </p>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
    <div className="flex flex-col gap-1 text-gray-500 text-sm">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" fill="none"><path d="M2 6.5A6.5 6.5 0 1115 6.5 6.5 6.5 0 012 6.5zm6.5 4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" fill="currentColor"/></svg>
        {date}
      </div>
      <div className="flex items-center gap-2">
        <svg width="16" height="16" fill="none"><path d="M8 2a6 6 0 016 6c0 4.418-6 10-6 10S2 12.418 2 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/></svg>
        {location}
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        Attendance
        <span>{Math.round((attendance / capacity) * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max={capacity}
        value={attendance}
        readOnly
        className="w-full accent-yellow-500"
      />
    </div>
    <button
      className={`w-full mt-2 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 ${
        ended
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-yellow-600 text-white hover:bg-yellow-700'
      }`}
      disabled={ended}
    >
      {ended ? (
        <>
          Event Ended
          <svg width="16" height="16" fill="none"><path d="M6 6l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </>
      ) : (
        'Join Event'
      )}
    </button>
  </div>
);

export default EventCard; 