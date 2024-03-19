import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import "@solana/wallet-adapter-react-ui/styles.css"
import Main from './Main';
import Coinflip from './Coinflip';

function App() {
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-gradient-to-r to-blue-500'>  
        
        <div className='absolute w-fit h-fit top-0 right-0 p-10'>
        <WalletMultiButton ></WalletMultiButton>
        </div>
        <Coinflip/>
    </div>

  );
}

export default App;
