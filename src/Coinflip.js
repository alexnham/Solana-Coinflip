import { Main } from "./Main";
import { User } from "./User";

const Coinflip = () => {
    const { count, imageSrc, visibility, choice, setChoice, onClick, decisionText, currState, claimWin, claimLoss } = Main()
    const { initialized, initializeUser, } = User()


    return (
        <div id="main">
            <h1 id="streak">Win Streak: {count}</h1>
            <div>
                <p id="title">Alex's Coin Flip</p>
                <img src={imageSrc} id="image" width="400px" alt="coin"></img>
            </div>
            {initialized && currState === 1 &&
                <div>
                    <button className="border p-5 " onClick={() => { claimWin() }}>Claim</button>
                    <h1 id="decision" className="text-green-400">I flipped {decisionText}, you win!</h1>
                    </div>}
            {initialized && currState === 2 &&
                <div>
                    <button className="border p-5 " onClick={() => { claimLoss(0) }}>Continue</button>
                    <h1 id="decision" className="text-red-500">I flipped {decisionText}, you lost</h1>
                    </div>}
            {!initialized && <button className="border p-5 " onClick={() => { initializeUser() }}>Initalize</button>}
            {visibility && initialized && currState === 0 &&
                <div id="buttons">
                    <button
                        className={` ${choice === "heads" ? "bg-green-500 border-2 border-green-500 rounded-md px-4 py-2 mr-2" : "bg-slate-400 bg-transparent border-2 border-transparent rounded-md px-4 py-2 mr-2"}`}
                        onClick={() => setChoice("heads")}
                    >
                        Heads
                    </button>
                    <button
                        className={` ${choice === "tails" ? "bg-green-500 border-2 border-green-500 rounded-md px-4 py-2" : "bg-slate-400 bg-transparent border-2 border-transparent rounded-md px-4 py-2"}`}
                        onClick={() => setChoice("tails")}
                    >
                        Tails
                    </button>
                </div>
            }

            {visibility && initialized && currState === 0 && <div>
                <button className='border border-gray-500 rounded-lg bg-slate-500 w-32 h-12' id="flipButton" onClick={onClick}>Flip</button>
            </div>}
        </div>
    );
}

export default Coinflip;