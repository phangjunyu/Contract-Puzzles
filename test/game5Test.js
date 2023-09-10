const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const qualifyingAddress = ethers.utils.getAddress("0x00000FfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf".toLowerCase())

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [qualifyingAddress],
    });
    const helpingSigner = await ethers.provider.getSigner(0)
    const winningSigner = await ethers.provider.getSigner(qualifyingAddress)

    return { game, helpingSigner, winningSigner };
  }
  it('should be a winner', async function () {
    const { game, helpingSigner, winningSigner } = await loadFixture(deployContractAndSetVariables);
    const winningSignerAddress = await winningSigner.getAddress()
    console.log(winningSignerAddress)
    // good luck
    await helpingSigner.sendTransaction({
      value: ethers.utils.parseEther("1"),
      to: winningSignerAddress
    })
    await game.connect(winningSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
