const EventCard = ({
  id,
  title,
  isOpen,
  description,
  duration,
  criteria,
  category,
  categoryId,
  artisan,
  artisanId,
  applications,
  createdAt,
  updatedAt,
}) => (
  <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
        {isOpen ? 'Open' : 'Closed'}
      </span>
      <span className="text-xs text-gray-500">ID: {id.slice(0, 6)}...</span>
    </div>
    <div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">{category}</span>
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">By: {artisan}</span>
      </div>
      <p className="text-gray-700 text-sm mb-2">{description}</p>
      <div className="flex flex-col gap-1 text-xs text-gray-600 mb-2">
        <div><b>Duration:</b> {duration}</div>
        <div><b>Criteria:</b> {criteria}</div>
      </div>
    </div>
    <div className="flex flex-col gap-1 text-gray-500 text-xs mb-2">
      <div>
        <b>Applicants:</b> {applications}
      </div>
      <div>
        <b>Created:</b> {new Date(createdAt).toLocaleDateString()}
      </div>
      <div>
        <b>Updated:</b> {new Date(updatedAt).toLocaleDateString()}
      </div>
    </div>
    <button
      className={`w-full mt-2 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 ${
        isOpen
          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
      disabled={!isOpen}
    >
      {isOpen ? 'Join Event' : 'Event Closed'}
    </button>
  </div>
);

export default EventCard;