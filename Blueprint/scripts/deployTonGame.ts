import { toNano } from '@ton/core';
import { TonGame } from '../wrappers/TonGame';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tonGame = provider.open(
        TonGame.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('TonGame')
        )
    );

    await tonGame.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tonGame.address);

    console.log('ID', await tonGame.getID());
}
