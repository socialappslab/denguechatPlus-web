import { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <p className="mt-3">
      <button
        type="button"
        className="my-6 rounded bg-gray-300 px-2 py-2 text-[#282C34] transition-all hover:bg-gray-200"
        onClick={() => setCount((prev) => prev + 1)}
      >
        count is {count}
      </button>
    </p>
  );
};

export default Counter;
