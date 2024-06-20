import logo from '@/assets/images/logo.svg';

const Header: React.FC = () => (
  <header className="flex flex-col items-center justify-center">
    <img data-testid="logo" src={logo} className="animate-speed h-40 motion-safe:animate-spin" alt="logo" />
    <style>
      {
        '\
      .animate-speed{\
        animation-duration:20s;\
      }\
    '
      }
    </style>
    <p className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-5xl font-black text-transparent selection:bg-transparent">
      DengueChat+
    </p>
  </header>
);

export default Header;
