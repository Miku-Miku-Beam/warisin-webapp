const StatCard = ({ totalApplied }) => (
    <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-8">
      <div>
        <div className="text-gray-500 text-sm">Total Applied Jobs</div>
        <div className="text-2xl font-bold">{totalApplied}</div>
      </div>
    </div>
  );
  export default StatCard;