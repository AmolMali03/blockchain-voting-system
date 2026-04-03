// Import SHA256 for hashing
const sha256 = require('sha256');
const { v4: uuidv4 } = require('uuid');

// Block class
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data; // vote data
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    // Generate hash
    calculateHash() {
        return sha256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data)
        );
    }
}

// Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    // First block
    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    // Get latest block
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add vote as block
    addBlock(data) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            data,
            this.getLatestBlock().hash
        );
        this.chain.push(newBlock);
    }

    // Validate chain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if (current.hash !== current.calculateHash()) return false;
            if (current.previousHash !== previous.hash) return false;
        }
        return true;
    }
}

module.exports = Blockchain;