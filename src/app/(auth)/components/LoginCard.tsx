const LoginCard = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-slate-50 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-8">Selamat Datang</h2>
      <button className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl shadow transition w-full justify-center">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
        Login with Google
      </button>
    </div>
  </div>
);

export default LoginCard; 