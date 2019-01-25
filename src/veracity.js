const Web3 = require('web3');

class Veracity {

  constructor(provider, address, abi, account) {
    this.web3 = new Web3(provider);
    this.account = account;
    this.address = address;
    this.veracityRegister = new this.web3.eth.Contract(abi, address);
  }

  hash(id, thing) {
    let h = (o) => this.web3.utils.soliditySha3(id, JSON.stringify(o));
    let register = (({owner, fingerprints, information, properties, manufacturingInformation, lifecycleInformation}) => ({
      owner, fingerprints, information, properties, manufacturingInformation, lifecycleInformation
    }))(thing);
    Object.keys(register).map((k, _) => {
      register[k] = h(register[k]);
    });
    let values = Object.values(register);
    register.passport = this.web3.utils.soliditySha3(id, ...values);
    return register;
  }

  async passport(id) {
    return await this.veracityRegister.methods.passport(id).call();
  }

  async details(id) {
    return await this.veracityRegister.methods.details(id).call();
  }

  async create(id, thing) {
    return await this.veracityRegister.methods.create(id, ...hashToParameters(this.hash(id, thing)))
        .send({from: this.account, gas: 500000});
  }

  async update(id, thing) {
    return await this.veracityRegister.methods.update(id, ...hashToParameters(this.hash(id, thing)))
        .send({from: this.account, gas: 500000});
  }
}

function hashToParameters(h) {
  return [
    h.owner,
    h.fingerprints,
    h.information,
    h.properties,
    h.manufacturingInformation,
    h.lifecycleInformation];
}

module.exports = Veracity;
