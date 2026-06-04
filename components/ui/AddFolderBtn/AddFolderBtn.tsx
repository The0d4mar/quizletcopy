'use client'

import { folderModal } from '@/store/addFolderStore';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useDispatch} from 'react-redux';



const AddFolderBtn = ({}) => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(folderModal(true));
    }
  return (
    <button className='border border-[var(--color-border)] rounded-[100%] w-6 h-6 flex items-center justify-center transition-colors duration-300 hover:border-[var(--color-hover)] transition-colors duration-300' onClick={handleClick} >
        <PlusIcon size={24} />
    </button>
  );
};

export default AddFolderBtn