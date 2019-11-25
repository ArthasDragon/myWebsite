import React, { useState, useEffect } from 'react';

function Bus() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `You Clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
export default Bus;
