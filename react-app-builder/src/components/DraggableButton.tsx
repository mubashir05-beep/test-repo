'use client';
import { useDrag } from 'react-dnd';
import { Button } from './ui/button';
import { useRef, useEffect } from 'react';

const DraggableButton: React.FC = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BUTTON',
    item: { type: 'button' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Create a ref for the button and attach it to `drag`
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      drag(buttonRef.current);
    }
  }, [drag]);

  return (
    <Button ref={buttonRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      Drag Me
    </Button>
  );
};

export default DraggableButton;
