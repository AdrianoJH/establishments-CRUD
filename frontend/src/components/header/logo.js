"use client";
import Image from 'next/image';
import styles from '@/app/page.module.css';

export default function Logo() {
    return (
        <Image src="images/logo.svg" width={40} height={40} alt='Logo' className={styles.logo} unoptimized />
    );
};