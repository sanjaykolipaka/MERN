const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

const dbName = 'Users';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

app.use(express.json());
app.use(cors());

//Creating an Account and Adding intial Amount of 5000
app.post('/', async (req, res) => {
    const { mobile } = req.body;
    console.log(`mobile = ${mobile}`)
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('User_Info');

        // Check if user exists
        const user = await collection.findOne({ mobile });

        if (!user) {
            // Insert new user if not found
            const formattedDate = new Date().toLocaleDateString();
            const formattedTime = new Date().toLocaleTimeString();
            const newUser = {
                name: `${mobile}Name`,
                mobile: mobile,
                email: `${mobile}@example.com`,
                balance: 5000,
                transactions: [
                    {
                        sender: "Relief Fund",
                        receiver: mobile,
                        amount: 5000,
                        Date: formattedDate,
                        Time: formattedTime,
                        Type: 'Credited'
                    }
                ]
            };
            await collection.insertOne(newUser);
            console.log("created")
            
            res.status(201).json({ message: 'New user created successfully', user: newUser });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.close();
    }
});




app.post('/recent-transactions', async (req, res) => {
    const { mobile } = req.body;
    

    try {
        await client.connect();
        const db = client.db(dbName);
        const user = await db.collection('User_Info').findOne({ mobile });
        console.log(user);
        
        if (user) {
            res.status(200).json({ transactions: user.transactions || [] });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.post('/transfer', async (req, res) => {
    const { mobile, receiver, amount } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('User_Info');

        const sender = await collection.findOne({ mobile });
        const receiverUser = await collection.findOne({ mobile: receiver });

        if (!sender || !receiverUser) return res.status(404).json({ message: 'Invalid sender or receiver' });

        if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

        const formattedDate = new Date().toLocaleDateString();
        const formattedTime = new Date().toLocaleTimeString();

        await collection.updateOne({ mobile }, {
            $inc: { balance: -amount },
            $push: {
                transactions: {
                    sender: mobile, receiver, amount, Date: formattedDate, Time: formattedTime, Type: 'Debited'
                }
            }
        });

        await collection.updateOne({ mobile: receiver }, {
            $inc: { balance: +amount },
            $push: {
                transactions: {
                    sender: mobile, receiver, amount, Date: formattedDate, Time: formattedTime, Type: 'Credited'
                }
            }
        });

        res.status(200).json({ message: 'Transaction successful' });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
