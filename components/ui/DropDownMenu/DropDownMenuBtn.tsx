'use client'

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import {FC} from 'react';

interface Label {
    label: string,
    icon: LucideIcon,
    active?: boolean,
    danger?: boolean,
    way?: string,
    onClick?: () => void,
}

interface DropDownMenuBtnProps {
    item: Label,
}

const DropDownMenuBtn: FC<DropDownMenuBtnProps> = ({item}) => {
    const router = useRouter();
    function call(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        console.log(item.way)
        item.onClick?.()
        if(item.danger) router.push('/')
    }
    const Icon = item.icon;
  return (
    <Link
        href={item.way ? item.way : ''}
        onClick={(e) => call(e)}
        className={`
            flex
            h-[44px]
            w-full
            items-center
            gap-4
            px-6
            text-left
            text-[15px]
            font-semibold
            transition-all
            duration-150

            ${
            item.active
                ? 'bg-[#3b3e52] text-white'
                : 'text-[#f1f1ff] hover:bg-[#2b2e45]'
            }

            ${
            item.danger
                ? 'text-[#ff5a5a] hover:bg-[rgba(255,90,90,0.12)]'
                : ''
            }
        `}
        >
        <span className="flex w-[18px] items-center justify-center">
            <Icon size={18}/>
        </span>

        <span>{item.label}</span>
    </Link>
  );
};

export default DropDownMenuBtn;