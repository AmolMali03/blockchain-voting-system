const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Added: Safely resolves folder paths
const Blockchain = require('./blockchain/blockchain'); // Make sure this matches your exact file name

const app = express();
const votingChain = new Blockchain();

// Middleware
app.use(bodyParser.json());

// Fixed: Safely point to the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Vote API
app.post('/vote', (req, res) => {
    const { voterId, candidate } = req.body;

    // ADD THIS LINE: It will print a message in your terminal every time a vote arrives
    console.log(`🔔 NEW VOTE RECEIVED: Voter ${voterId} chose ${candidate}`);

    // Add vote block
    votingChain.addBlock({
        voterId,
        candidate
    });

    res.json({ message: "Vote Recorded Successfully!" });
});

// Get results
app.get('/results', (req, res) => {
    const votes = votingChain.chain.slice(1);
    const result = {};

    votes.forEach(block => {
        const candidate = block.data.candidate;
        result[candidate] = (result[candidate] || 0) + 1;
    });

    res.json(result);
});

// Explorer
app.get('/blocks', (req, res) => {
    res.json(votingChain.chain);
});

// Fallback route: If user visits the root domain, serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});