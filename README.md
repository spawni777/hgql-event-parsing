# hgql-event-logs
To copy .env:
```bash
cp .env.example .env
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run example.ts
```

---
This repo has a small EventTest.sol contract that was injected
to the hedera testnet at address: 
```dotenv
CONTRACT_ID=4420050
CONTRACT_EVM=0xe04913457812bf84a3e2403616d0e68ba44e6eb9
```

Application binary interface (ABI) of this contract locates in `./abi.json`.


This example is using `ethers` library to parse contract events, 
and `@hgraph.io/sdk` to fetch required contract event logs.
