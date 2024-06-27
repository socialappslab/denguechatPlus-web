import Counter from '@/components/Counter';
import Docs from '@/components/Docs';
import Header from '@/components/Header';

const App: React.FC = () => (
  <div className="text-center selection:bg-green-900 bg-[#282c34] text-white min-h-screen pt-32">
    <Header />
    <Counter />
    <Docs />
  </div>
);

export default App;
