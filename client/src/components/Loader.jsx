const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-blue-500">
          <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
