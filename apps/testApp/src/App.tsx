import {useState} from 'react';

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <img src={"/mockThisUrl"} alt="Mocked image" height={100} width={200} />
      </div>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}
