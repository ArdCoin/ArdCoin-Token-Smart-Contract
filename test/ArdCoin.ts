import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("ArdCoin Tests", function() {

  async function deployArdCoin() {
    const [owner, account2, account3] = await ethers.getSigners();

    const ArdCoinContract = await ethers.getContractFactory("ArdCoin");
    const token = await ArdCoinContract.deploy();

    await token.mint(owner.address, ethers.parseEther("10"))

    return { token, owner, account2, account3 };
  }

  describe("Deployment", function() {

    it("Checking Name/Symbol", async function() {
      const { token } = await loadFixture(deployArdCoin);

      expect(await token.symbol()).to.equal("ARDX");
      expect(await token.name()).to.equal("ArdCoin");
    });

    it("Checking Supply", async function() {
      const { token } = await loadFixture(deployArdCoin);

      expect(await token.totalSupply()).to.equal(ethers.parseEther("10"));
    });

  })

  describe("Check Roles", function() {

    it("Checking Mint OnlyRole Modifier", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      await expect(token.connect(account2).mint(account2.address,ethers.parseEther("40"))).to.be.revertedWith(
        `AccessControl: account ${account2.address.toLowerCase()} is missing role ${await token.MINTER_ROLE()}`
      );
    });

    it("Checking BlackList OnlyRole Modifier", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      await expect(token.connect(account2).blackListUpdate(account2.address,false)).to.be.revertedWith(
        `AccessControl: account ${account2.address.toLowerCase()} is missing role ${await token.BLACKLIST_ROLE()}`
      );
    });

    it("Checking Pauser OnlyRole Modifier", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      await expect(token.connect(account2).pause()).to.be.revertedWith(
        `AccessControl: account ${account2.address.toLowerCase()} is missing role ${await token.PAUSER_ROLE()}`
      );
    });

    it("Checking BlackList OnlyRole Modifier", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      await expect(token.connect(account2).snapshot()).to.be.revertedWith(
        `AccessControl: account ${account2.address.toLowerCase()} is missing role ${await token.SNAPSHOT_ROLE()}`
      );
    });

  })

  describe("Check Blacklist", function() {

    it("Checking isBlackListed/blackListUpdate Function and BeforeTransfer BlackListRevert error - full flow", async function() {
      const { token , account2, account3 } = await loadFixture(deployArdCoin);

      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("0"));
      await token.mint(account2.address, ethers.parseEther("10"))
      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("10"));
      
      await token.connect(account2).transfer(account3.address, ethers.parseEther("5"))

      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("5"));
      expect(await token.balanceOf(account3.address)).to.equal(ethers.parseEther("5"));

      expect(await token.isBlackListed(account2.address)).to.equal(false);
      await token.blackListUpdate(account2.address,true)
      expect(await token.isBlackListed(account2.address)).to.equal(true);

      await expect(token.connect(account2).transfer(account3.address,ethers.parseEther("5"))).to.be.revertedWith(
        `Token transfer refused. Sender is on blacklist`
      );
      await expect(token.connect(account3).transfer(account2.address,ethers.parseEther("5"))).to.be.revertedWith(
        `Token transfer refused. Receiver is on blacklist`
      );
    });

  })

  describe("Check Burn", function() {

    it("Checking burn()", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      await token.mint(account2.address, ethers.parseEther("10"))
      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("10"));

      await token.connect(account2).burn(ethers.parseEther("5"))
      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("5"));

      await expect(token.connect(account2).burn(ethers.parseEther("20"))).to.be.revertedWith(
        `ERC20: burn amount exceeds balance`
      );
    });

    it("Checking burnFrom()", async function() {
      const { token , account2 , account3 } = await loadFixture(deployArdCoin);

      await token.mint(account2.address, ethers.parseEther("10"))
      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("10"));

      expect(await token.allowance(account2.address,account3.address)).to.equal(ethers.parseEther("0"));
      await token.connect(account2).approve(account3.address,ethers.parseEther("5"))
      expect(await token.allowance(account2.address,account3.address)).to.equal(ethers.parseEther("5"));

      await token.connect(account3).burnFrom(account2.address,ethers.parseEther("5"))
      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("5"));

      await expect(token.connect(account3).burnFrom(account2.address,ethers.parseEther("20"))).to.be.revertedWith(
        `ERC20: insufficient allowance`
      );
    });

  })

  describe("Check Pause", function() {

    it("Checking pause/unpause", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      expect(await token.paused()).to.equal(false);

      await token.transfer(account2.address,ethers.parseEther("5"))
      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("5"));

      await token.pause()
      expect(await token.paused()).to.equal(true);

      await expect(token.transfer(account2.address,ethers.parseEther("5"))).to.be.revertedWith(`Pausable: paused`);

      await expect(token.connect(account2).unpause()).to.be.revertedWith(
        `AccessControl: account ${account2.address.toLowerCase()} is missing role ${await token.PAUSER_ROLE()}`
      );
      await token.unpause()
      expect(await token.paused()).to.equal(false);
    });

  })

  describe("Check Snapshot", function() {

    it("Checking snapshot()", async function() {
      const { token , account2 } = await loadFixture(deployArdCoin);

      await token.snapshot()

      await token.mint(account2.address, ethers.parseEther("10"))

      let id = await token.getCurrentSnapshot()
      expect(await token.totalSupplyAt(id)).to.equal(ethers.parseEther("10"));
      expect(await token.totalSupply()).to.equal(ethers.parseEther("20"));

      expect(await token.balanceOf(account2.address)).to.equal(ethers.parseEther("10"));
      expect(await token.balanceOfAt(account2.address,id)).to.equal(ethers.parseEther("0"));
    });

    it("Checking OnlyRole SNAPSHOT_ROLE",async function(){
      const { token , account2 } = await loadFixture(deployArdCoin);

      await token.snapshot()
      await token.mint(account2.address, ethers.parseEther("10"))
      await expect(token.connect(account2).getCurrentSnapshot()).to.be.revertedWith(
        `AccessControl: account ${account2.address.toLowerCase()} is missing role ${await token.SNAPSHOT_ROLE()}`
      );

    })
  })

  describe("Checking Constants", function() {

    it("Checking Role Constants", async function() {
      const { token } = await loadFixture(deployArdCoin);

      expect(await token.SNAPSHOT_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("SNAPSHOT_ROLE")));
      expect(await token.PAUSER_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("PAUSER_ROLE")));
      expect(await token.BLACKLIST_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("BLACKLIST_ROLE")));
      expect(await token.MINTER_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE")));
    });
  })

});
