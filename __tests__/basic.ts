import {
    signerKeys,
    TonClient,
} from "@eversdk/core";
import {
    loadContract,
    init,
    done,
} from "./utils";
import {
    Account,
    AccountType,
} from "../src";

beforeAll(init);
afterAll(done);
const helloContract = () => loadContract("Hello");

test("Account Basic Usage", async () => {
    const client = TonClient.default;
    const startTimeInSeconds = Math.floor(Date.now() / 1000);

    const acc = new Account(helloContract(), {
        signer: signerKeys(await client.crypto.generate_random_sign_keys()),
        client,
    });

    const address = await acc.getAddress();
    expect(address.substr(0, 2)).toEqual("0:");

    await acc.deploy({useGiver: true});
    expect(Number.parseInt((await acc.getAccount()).balance)).toBeGreaterThan(500_000_000);

    let response = await acc.run("touch", {});
    expect(response.transaction.id).toHaveLength(64);

    response = await acc.runLocal("sayHello", {});
    const timestampInSeconds = Number(response.decoded?.output.value0);
    expect(timestampInSeconds).toBeGreaterThanOrEqual(startTimeInSeconds);
});

test("Calc Fees", async () => {
    const client = TonClient.default;
    const account = new Account(helloContract(), {
        signer: signerKeys(await client.crypto.generate_random_sign_keys()),
        client,
        useCachedState: true,
    });

    const deployFees = await account.calcDeployFees();
    expect(deployFees.total_account_fees).toBeGreaterThan(13_300_000);

    await account.deployLocal();

    const runFees = await account.calcRunFees("touch", {});
    expect(runFees.total_account_fees).toBeGreaterThan(5_550_000);
});

test("Uninit State", async () => {
    const client = TonClient.default;
    const account = new Account(helloContract(), {
        signer: signerKeys(await client.crypto.generate_random_sign_keys()),
        client,
    });
    expect((await account.getAccount()).acc_type).toEqual(AccountType.nonExist);
    const giver = await Account.getGiverForClient(client);
    await giver.sendTo(await account.getAddress(), 200_000_000);

    account.refresh();
    expect((await account.getAccount()).acc_type).toEqual(AccountType.uninit);
});

test("Local run without `useCachedState`", async () => {
    const client = TonClient.default;
    const account = new Account(helloContract(), {
        signer: signerKeys(await client.crypto.generate_random_sign_keys()),
        client,
    });
    await account.deployLocal();
    await expect(account.calcRunFees("touch", {})).rejects.toHaveProperty(
      'message',
      expect.stringMatching(/Account does not exists on the blockchain/)
    )
});
