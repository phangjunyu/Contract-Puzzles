const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signerX = ethers.provider.getSigner(0);
    const signerY = ethers.provider.getSigner(1);

    return { game, signerX, signerY };
  }
  it('should be a winner', async function () {
    const { game, signerX, signerY } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    await game.connect(signerY).write(signerX.getAddress());
    await game.connect(signerX).win(signerY.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
