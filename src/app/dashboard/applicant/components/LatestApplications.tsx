const LatestApplications = ({ applications }) => (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Latest Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-500">You haven’t applied to any job yet.</p>
      ) : (
        <ul>
          {applications.map((app, idx) => (
            <li key={idx}>{app.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
  export default LatestApplications;