import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

const Home = ({ loggedIn }) => {
    const [transactions, setTransactions] = useState([]);
    const [Send, setSend] = useState(false);
    const [Receive, setReceive] = useState(false);
    const [message, setMessage] = useState('');
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const location = useLocation();
    const mobile = location.state?.mobile;

    const receiver = watch('receiver');
    const amount = watch('amount');

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    const fetchRecentTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/recent-transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile }), 
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions || []);
            } 
        } catch (error) {
            setTransactions([]);
        }
    }

    const sendMoney = async () => {
        try {
            const response = await fetch('http://localhost:3000/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile, receiver, amount }),
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.ok) fetchRecentTransactions(); // Refresh transactions after sending money
        } catch (error) {
            console.error('Error during transaction:', error);
            setMessage('Error during transaction');
        }
    };

    return (
        <>
            {loggedIn ? (
                <div>
                    <div className="w-1/2 justify-self-center mt-10">
                        <div className="container flex justify-around max-w-full border-2 border-violet-500 py-4 rounded-lg">
                            <button onClick={() => { setSend(true); setReceive(false); }} className="cards w-[20%] flex flex-col items-center hover:bg-violet-400 rounded-md p-2">
                                <img className="w-10" src="sendmoney.png" alt="Send Money" />
                                <p className="font-semibold">Send</p>
                            </button>
                            <button onClick={() => setReceive(true)} className="cards flex flex-col items-center hover:bg-violet-400 rounded-md p-2">
                                <img className="w-10" src="receivemoney.png" alt="Receive Money" />
                                <p className="font-semibold">Receive</p>
                            </button>
                            <button  className="cards flex flex-col items-center hover:bg-violet-400 rounded-md p-2">
                                <img className='w-10 ml-3' src="checkbalance.png" alt="Check Balance" />
                                <p className='font-semibold'>Balance</p>
                            </button>

                        </div>
                        {(Send && !Receive) ? (
                            <form className="border-2 border-violet-500 mt-4 rounded-lg p-4" onSubmit={handleSubmit(sendMoney)}>
                                <div className="flex justify-center items-center p-3">
                                    <label htmlFor="receiver" className="w-1/4">Mobile</label>
                                    <input className="border-2 border-violet-400 rounded-md px-3"
                                        type="text" {...register('receiver', { required: true })}
                                        placeholder="Mobile or UPI ID"
                                    />
                                </div>
                                <div className="flex justify-center items-center p-3">
                                    <label htmlFor="amount" className="w-1/4">Amount</label>
                                    <input className="border-2 border-violet-400 rounded-md px-3"
                                        type="text" {...register('amount', { required: true })}
                                        placeholder="Amount"
                                    />
                                </div>
                                <button className="w-1/4 flex justify-self-center bg-violet-800 p-2 text-white font-semibold rounded-md hover:bg-violet-700 " type="submit">Send</button>
                            </form>
                        ):(<div></div>)}
                        {Receive && (
                            <div>
                                Mobile: {mobile}
                                <br />
                                UPI ID: {mobile}@payyee
                            </div>
                        )}
                    </div>

                    <div className="border border-violet-400 justify-self-center w-1/2 mt-5 p-4">
                        <h3 className="font-bold text-lg mb-2">Recent Transactions</h3>
                        {transactions.length > 0 ? (
                            transactions.reverse().map((transaction, index) => (
                                <div key={index} className="border-b py-2 flex justify-between">
                                    <div className="">
                                        {(transaction.Type === 'Credited') ? (<div className="text-xs">From: {transaction.sender}</div>) : (<div className="text-xs">To: {transaction.receiver}</div>)}
                                        
                                        <div className="flex gap-5 text-xs">
                                            <span>{transaction.Date}</span>
                                            <span>{transaction.Time}</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`text-xs font-semibold ${transaction.Type === "Credited"
                                                ? "text-green-500"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {transaction.Type === "Credited" ? "+" : "-"}
                                        {transaction.amount}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs">No recent transactions</p>
                        )}
                    </div>
                </div>
            ) : (<div>Please Login</div>)}
        </>
    );
};

export default Home;
