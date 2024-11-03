'use client';
import { useDrop } from 'react-dnd';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';

const DropArea: React.FC = () => {
  const [components, setComponents] = useState<{ type: string }[]>([]);

  const [{ isOver }, drop] = useDrop({
    accept: 'BUTTON',
    drop: (item: { type: string }) => addComponent(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const addComponent = (item: { type: string }) => {
    setComponents((prev) => [...prev, item]);
  };

  // Create a ref for the div and use it with `drop`
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      drop(divRef.current);
    }
  }, [drop]);

  return (
    <div
      ref={divRef}
      className={`border-2 border-dashed ${isOver ? 'bg-gray-200' : 'bg-white'}`}
      style={{ padding: '20px', minHeight: '200px' }}
    >
      {components.length === 0 && <p>Drop items here</p>}
      {components.map((_, index) => (
        <Button key={index} className="m-2">Button {index + 1}</Button>
      ))}
    </div>
  );
};

export default DropArea;
