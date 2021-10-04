# Add Contract to your App

## Run ABI Get Method with AppKit

* [About ABI Get Method](3_run_abi_get_method_with_appkit.md#about-abi-get-method)
* [Run ABI get method](3_run_abi_get_method_with_appkit.md#run-abi-get-method)
* [Sample source code](3_run_abi_get_method_with_appkit.md#sample-source-code)

## About ABI Get Method

Get method is a method that is executed locally and it does not change account state. Get methods are used to retrieve contract data locally for free.

ABI compatible contract - a contract which has an ABI interface.

## Run ABI get method

AppKit provides `runLocal` method for running get methods of ABI-compatible contracts.

```text
const dePoolAddress = "0:a07c4668a8ac1801b5ea77c86e317ca027d76c288c6da4d29d7d1fd716aff40a";

const dePoolAcc = new Account(DePoolContract, {
    address: dePoolAddress,
    client,
    signer: signerNone(), 
});

response = await dePoolAcc.runLocal("getDePoolInfo", {});
console.log(`DePool ${dePoolAddress} Info:`, response.decoded.output);
const validatorWallet = response.decoded.output.validatorWallet;

response = await dePoolAcc.runLocal("getParticipantInfo", { "addr": validatorWallet });
console.log(`\nValidator Wallet ${validatorWallet} Stake Info:`, response.decoded.output);

response = await dePoolAcc.runLocal("getDePoolBalance", {});
console.log(`\nDePool Balance Nano Crystal:`, response.decoded.output.value0);
```

## Sample source code

Observe the full sample: [https://github.com/tonlabs/sdk-samples/tree/master/appkit-examples/depool-statistics](https://github.com/tonlabs/sdk-samples/tree/master/appkit-examples/depool-statistics)

Check out [core api documentation](https://github.com/tonlabs/TON-SDK/blob/master/guides/work_with_contracts/3_run_abi_get_method.md) for more information about running get methods.
