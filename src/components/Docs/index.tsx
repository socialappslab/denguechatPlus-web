const Docs: React.FC = () => (
  <div className="flex flex-col items-center justify-center">
    <p>
      Edit <code className="text-[#8d96a7]">App.tsx</code> and save to test HMR updates.
    </p>
    <p className="mt-3 flex gap-3 text-center text-[#8d96a7]">
      <a
        className="text-[#61dafb] transition-all hover:text-blue-400"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      {' | '}
      <a
        className="text-[#61dafb] transition-all hover:text-blue-400"
        href="https://vitejs.dev/guide/features.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vite Docs
      </a>
    </p>
  </div>
);

export default Docs;
