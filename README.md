# Veracity

Javascript library for Veracity Protocol Light-infrastructure

Install dependencies (node 10+ recommended)

```
npm install
```

In order to run tests, [veracity-register](https://github.com/ValueProtocol/veracity-register#readme) has to be compiled in `../veracity-protocol` and Ganache test Ethereum node running

```
cd ../veracity-register
npm install
npm run truffle compile
npm run ganache > /dev/null &
cd -
```

then you can jest run tests :)

```
npm test
```
