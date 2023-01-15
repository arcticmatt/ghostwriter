import { useEffect, useRef, useState } from "react";
import joinClasses from "~/utils/joinClasses";

const NAMES = ["poem", "haiku", "riddle", "song"];

export default function Typewriter(): JSX.Element {
  const [name, setName] = useState(NAMES[0]);
  const nameIndexRef = useRef(0);

  // 1. Delete name
  // 2. When name length is 0, increment nameIndex and start adding new name
  // 3. When new name is finished, go back to step 1
  useEffect(() => {
    function addName() {
      const interval = setInterval(() => {
        setName((currName) => {
          if (currName.length === NAMES[nameIndexRef.current].length) {
            clearInterval(interval);
            setTimeout(() => {
              deleteName();
            }, 1500);
            return currName;
          }

          return NAMES[nameIndexRef.current].slice(0, currName.length + 1);
        });
      }, 100);
      return interval;
    }

    function deleteName() {
      const interval = setInterval(() => {
        setName((currName) => {
          if (currName.length === 0) {
            clearInterval(interval);
            nameIndexRef.current = (nameIndexRef.current + 1) % NAMES.length;
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
