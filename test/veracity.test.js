const Veracity = require("../src/veracity");
const Web3 = require("web3");
const sample = require("./artwork.json");
const schema = require("../../veracity-register/build/contracts/VeracityRegister.json");
const contract = require("truffle-contract");

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const account = "0xff06139b8be9f046d33c10f2814e23873b3c5301";

describe("Veracity", () => {

  let veracity;
  let artwork;
  let id = 123;

  beforeEach(async () => {
    artwork = JSON.parse(JSON.stringify(sample));
    let VeracityRegister = contract(schema);
    VeracityRegister.setProvider(provider);
    let veracityRegister = await VeracityRegister.new({from: account});
    veracity = new Veracity(provider, veracityRegister.address, VeracityRegister.abi, account);
  });

  test("instance created", () => {
    expect(veracity);
  });

  test("create passport", async () => {
    await veracity.create(id, artwork);
  });

  test("hash", async () => {
    expect.any(veracity.hash(id, artwork));
  });

  test("hash stability", async () => {
    expect(veracity.hash(id, artwork).passport)
        .toBe(veracity.hash(id, artwork).passport);
  });

  test("check passport veracity", async () => {
    await veracity.create(id, artwork);
    expect(await veracity.passport(id))
        .toBe(veracity.hash(id, artwork).passport);
  });

  test("passport changes", async () => {
    let oldPassport = veracity.hash(id, artwork).passport;
    artwork.fingerprints = [":)"];
    expect(veracity.hash(id, artwork).passport).not.toBe(oldPassport);
  });

  test("failed check", async () => {
    await veracity.create(id, artwork);
    artwork.fingerprints = [":)"];
    expect(await veracity.passport(id))
        .not.toBe(veracity.hash(id, artwork).passport);
    expect((await veracity.details(id)).fingerprints)
        .not.toBe(veracity.hash(id, artwork).fingerprints);
  });

  test("update", async () => {
    await veracity.create(id, artwork);
    artwork.fingerprints = [":)"];
    expect(await veracity.passport(id))
        .not.toBe(veracity.hash(id, artwork).passport);
    await veracity.update(id, artwork);
    expect(await veracity.passport(id))
        .toBe(veracity.hash(id, artwork).passport);
  });
});
