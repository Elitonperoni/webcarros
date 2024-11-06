import logoImg  from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiUser, FiLogIn } from 'react-icons/fi';

export function Header() {
    const signed = false;
    const loadingAuth = false;

    return (
      <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
        <header className='flex w-full items-center justify-between '>
          <Link to="/">
            <img src={logoImg} 
              alt="Logo do Site" />
          </Link>

          <Link to="/dashboard">
            <FiUser size={24} color="#000"/>
          </Link>
        </header>
      </div>
    )

  }
  