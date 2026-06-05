'use client'

import { Ellipsis } from 'lucide-react';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import DropdownMenu from '../DropDownMenu/DropDownMenu';

interface DropDownDeckMenuProps {
  localId: string;
  windowFlag: string;
} 

const DropDownDeckMenu: React.FC<DropDownDeckMenuProps> = ( { localId, windowFlag = 'openedDeck' } ) => {
  const sendedFlag = windowFlag;
  const [dropDownFlag, setDropDownFlag] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const changeDropDownFlag = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    setDropDownFlag((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setDropDownFlag(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
        "
        onClick={changeDropDownFlag}
      >
        <Ellipsis />
      </button>

      {dropDownFlag && <DropdownMenu localId={localId} windowFlag={sendedFlag} />}
    </div>
  );
};

export default DropDownDeckMenu;