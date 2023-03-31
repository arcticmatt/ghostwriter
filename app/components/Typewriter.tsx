import { useEffect, useRef, useState } from "react";
import joinClasses from "~/utils/joinClasses";

export default function Typewriter({
  options,
}: {
  options: string[];
}): JSX.Element {
  const [name, setName] = useState(options[0]);
  const nameIndexRef = useRef(0);

  // 1. Delete name
  // 2. When name length is 0, increment nameIndex and start adding new name
  // 3. When new name is finished, go back to step 1
  useEffect(() => {
    function addName() {
      const interval = setInterval(() => {
        setName((currName) => {
          if (currName.length === options[nameIndexRef.current].length) {
            clearInterval(interval);
            setTimeout(() => {
              deleteName();
            }, 1500);
            return currName;
          }

          return options[nameIndexRef.current].slice(0, currName.length + 1);
        });
      }, 100);
      return interval;
    }

    function deleteName() {
      const interval = setInterval(() => {
        setName((currName) => {
          if (currName.length === 0) {
            clearInterval(interval);
            nameIndexRef.current = (nameIndexRef.current + 1) % options.length;
            setTimeout(() => {
              addName();
            }, 500);
            return currName;
          }

          return currName.slice(0, currName.length - 1);
        });
      }, 100);
      return interval;
    }

    const interval = deleteName();

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {name}
      <div className={joinClasses("blink", "cursor")} />
    </>
  );
}
