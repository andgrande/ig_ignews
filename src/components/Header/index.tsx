import Image from 'next/image';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';

import LogoImg from '../../../public/images/logo.svg';
import styles from './styles.module.scss';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src={LogoImg} alt="ignews" />
                <nav>
                    <ActiveLink href="/" activeClassName={styles.active}>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active}>
                        <a>Posts</a>
                    </ActiveLink>
                    
                </nav>
                
                <SignInButton />
            </div>
        </header>
    )
}