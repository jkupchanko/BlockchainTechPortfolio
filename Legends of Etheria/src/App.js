import React, { useEffect, useState } from "react";
import Web3 from "web3";
import TokenContractABI from "./build/contracts/Token.json";
import "./App.css";

const TOKEN_ADDRESS = "0x9b2E16D585B4B5eA56226a59daB2d741daA82f2a";
const wantChainId = "0x539";
const COOLDOWN_DURATION = 60; // Cooldown duration in seconds
const MIN_TOKEN_ID = 0;
const MAX_TOKEN_ID = 2;

function App() {
  const [web3, setWeb3] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState("");
  const [maticBalance, setMaticBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [counters, setCounters] = useState({});
  const [isMintingCooldown, setIsMintingCooldown] = useState(false);
  const [mintingCooldowns, setMintingCooldowns] = useState({});

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== wantChainId) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: wantChainId,
                  chainName: "Localhost",
                  rpcUrls: ["http://localhost:8545"],
                  nativeCurrency: {
                    name: "Local ETH",
                    symbol: "lETH",
                    decimals: 18,
                  },
                },
              ],
            });
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x539" }],
            });
          }
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("Metamask not found");
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (web3) {
      const tokenContractInstance = new web3.eth.Contract(
        TokenContractABI.abi,
        TOKEN_ADDRESS
      );
      setTokenContract(tokenContractInstance);
    }
  }, [web3]);

  useEffect(() => {
    const fetchMaticBalance = async () => {
      if (web3 && account) {
        const balance = await web3.eth.getBalance(account);
        setMaticBalance(web3.utils.fromWei(balance, "ether"));
      }
    };

    fetchMaticBalance();
  }, [web3, account]);

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (tokenContract && account) {
        const balances = [];
        for (let i = 0; i < 7; i++) {
          const balance = await tokenContract.methods
            .balanceOf(account, i)
            .call();
          balances.push({ tokenId: i, balance: balance.toString() });
        }
        setTokenBalances(balances);
      }
    };

    fetchTokenBalances();
  }, [tokenContract, account]);

  useEffect(() => {
    const cooldownInterval = setInterval(() => {
      setMintingCooldowns((prevCooldowns) => {
        const updatedCooldowns = { ...prevCooldowns };
        let isCooldownUpdated = false;

        for (let tokenId = MIN_TOKEN_ID; tokenId <= MAX_TOKEN_ID; tokenId++) {
          if (
            updatedCooldowns[tokenId] &&
            updatedCooldowns[tokenId] > Date.now()
          ) {
            updatedCooldowns[tokenId] -= 1000;
            isCooldownUpdated = true;
          } else if (updatedCooldowns[tokenId]) {
            delete updatedCooldowns[tokenId];
            isCooldownUpdated = true;
          }
        }

        return isCooldownUpdated ? updatedCooldowns : prevCooldowns;
      });
    }, 1000);

    return () => {
      clearInterval(cooldownInterval);
    };
  }, []);

  const mintTokens = async (tokenId) => {
    if (tokenContract) {
      try {
        const tx = await tokenContract.methods
          .mintTokens(tokenId)
          .send({ from: account });
        console.log(tx);

        setTokenBalances((prevBalances) =>
          prevBalances.map((balance) =>
            balance.tokenId === tokenId
              ? {
                  ...balance,
                  balance: (parseInt(balance.balance) + 1).toString(),
                }
              : balance
          )
        );

        setCounters((prevCounters) => ({
          ...prevCounters,
          [tokenId]: (prevCounters[tokenId] || 0) + 1,
        }));

        if (tokenId === 3) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            0: (prevCounters[0] || 0) - 1,
            1: (prevCounters[1] || 0) - 1,
          }));
        } else if (tokenId === 4) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            1: (prevCounters[1] || 0) - 1,
            2: (prevCounters[2] || 0) - 1,
          }));
        } else if (tokenId === 5) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            0: (prevCounters[0] || 0) - 1,
            2: (prevCounters[2] || 0) - 1,
          }));
        } else if (tokenId === 6) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            0: (prevCounters[0] || 0) - 1,
            1: (prevCounters[1] || 0) - 1,
            2: (prevCounters[2] || 0) - 1,
          }));
        } else {
          return "Incorrect Selection!";
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const mintToken = async (tokenId) => {
    if (
      !isMintingCooldown &&
      tokenId >= MIN_TOKEN_ID &&
      tokenId <= MAX_TOKEN_ID
    ) {
      if (tokenContract) {
        try {
          setIsMintingCooldown(true);
          await mintTokens(tokenId);
          setMintingCooldowns((prevCooldowns) => ({
            ...prevCooldowns,
            [tokenId]: Date.now() + COOLDOWN_DURATION * 1000, // Convert to milliseconds
          }));

          setTimeout(() => {
            setIsMintingCooldown(false);
          }, COOLDOWN_DURATION * 1000);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const forge = async (tokenId) => {
    if (tokenContract) {
      try {
        await tokenContract.methods
          .forgingBurn(tokenId)
          .send({ from: account });
        setTokenBalances((prevBalances) =>
          prevBalances.map((balance) =>
            balance.tokenId === tokenId
              ? {
                  ...balance,
                  balance: (parseInt(balance.balance) - 1).toString(),
                }
              : balance
          )
        );
        if (tokenId === 3) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            3: (prevCounters[3] || 0) - 1,
          }));
        } else if (tokenId === 4) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            4: (prevCounters[4] || 0) - 1,
          }));
        } else if (tokenId === 5) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            5: (prevCounters[5] || 0) - 1,
          }));
        } else if (tokenId === 6) {
          setCounters((prevCounters) => ({
            ...prevCounters,
            6: (prevCounters[6] || 0) - 1,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tradeForToken = async (tokenId) => {
    if (tokenContract) {
      try {
        const highestCountTokenId = Object.keys(counters).reduce((a, b) =>
          counters[a] > counters[b] ? a : b
        );

        setCounters((prevCounters) => ({
          ...prevCounters,
          [highestCountTokenId]: (prevCounters[highestCountTokenId] || 0) - 1,
          [tokenId]: (prevCounters[tokenId] || 0) + 1,
        }));

        await tokenContract.methods
          .tradeForToken(tokenId, highestCountTokenId)
          .send({ from: account });

        setTokenBalances((prevBalances) =>
          prevBalances.map((balance) =>
            balance.tokenId === highestCountTokenId
              ? {
                  ...balance,
                  balance: (parseInt(balance.balance) - 1).toString(),
                }
              : balance
          )
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Fantasy Quest: Legends of Etheria - Upgradables</h1>
      <h2>Account: {account}</h2>
      <h2>Matic Balance: {maticBalance} MATIC</h2>
      <ul>
        {tokenBalances.map((balance) => (
          <li key={balance.tokenId}>
            Token ID: {balance.tokenId}, Balance: {balance.balance}
          </li>
        ))}
      </ul>
      <h2>Active Transactions: </h2>
      <ul>
        {Object.entries(counters).map(([tokenId, count]) => (
          <li key={tokenId}>
            Token ID: {tokenId}, Count: {count}
          </li>
        ))}
      </ul>
      <h2>Minting Cooldowns:</h2>
      <ul>
        {Object.entries(mintingCooldowns).map(([tokenId, cooldown]) => (
          <li key={tokenId}>
            Token ID: {tokenId}, Cooldown:{" "}
            {new Date(cooldown).toLocaleTimeString()}
          </li>
        ))}
      </ul>
      <h2>Adventure Tokens</h2>
      <p>
        As a brave adventurer in the mystical world of Etheria, you have the
        power to mint tokens that represent unique items or abilities to aid you
        on your quest. <br></br>Minting tokens "Gun," "Sword," and "Bomb" is
        free, but there is a 1-minute cooldown between each minting action.
        <br></br> Please note that there may be gas costs associated with
        completing the transaction.
      </p>
      <div className="button-row row-mint-tokens">
        <button onClick={() => mintToken(0)}>Gun</button>
        <button onClick={() => mintToken(1)}>Sword</button>
        <button onClick={() => mintToken(2)}>Bomb</button>
      </div>

      <h2>Token Upgrades</h2>
      <p>
        Some tokens possess extraordinary potential.<br></br> By combining the
        power of other tokens, you can unlock even greater abilities.<br></br>{" "}
        Token "Magic Scroll" can be minted by burning tokens "Gun" and "Sword,"
        while token "Elixir" requires the sacrifice of tokens "Sword" and
        "Bomb".
        <br></br> Token "Grapple Hook" can be created by consuming tokens "Gun"
        and "Bomb," and the pinnacle of power, token "Crossbow," can only be
        obtained by burning tokens "Gun," "Sword," and "Bomb".
      </p>

      <div className="button-row row-mint-tokens">
        <button onClick={() => mintTokens(3)}>Magic Scroll</button>
        <button onClick={() => mintTokens(4)}>Elixir</button>
        <button onClick={() => mintTokens(5)}>Grapple Hook</button>
        <button onClick={() => mintTokens(6)}>Crossbow</button>
      </div>

      <h2>Combat Tokens</h2>
      <p>
        Token Forge: Tokens "Shield," "Armor," "Potion," and "Cast Fireball"
        hold immense power on their own and cannot be forged into other tokens.
        <br></br>
        These legendary artifacts represent the culmination of your journey and
        cannot be further enhanced.
      </p>

      <h2>Token Burning</h2>
      <p>
        Should the need arise, you have the option to burn tokens "Shield,"
        "Armor," "Potion," and "Cast Fireball".<br></br> However, be warned that
        once these tokens are sacrificed, they are lost forever, and no rewards
        will be granted in return.<br></br> Use this option wisely, for the fate
        of Etheria rests in your hands.
      </p>

      <div className="button-row row-forge-tokens">
        <button onClick={() => forge(3)}>Shield</button>
        <button onClick={() => forge(4)}>Armor</button>
        <button onClick={() => forge(5)}>Potion</button>
        <button onClick={() => forge(6)}>Cast Fireball</button>
      </div>

      <h2>Token Trading</h2>
      <p>
        In the vast realm of Etheria, collaboration and cooperation are
        essential.<br></br> Should you desire a different token, you can engage
        in trades.<br></br> Any token in your possession can be exchanged for
        tokens "Golden Key," "Open Chest," and "Collect Gemstone" by selecting
        the "Trade This" button.<br></br>Choose your trades wisely, as each
        token possesses its own unique powers and strategic value.
      </p>

      <div className="button-row row-trade-tokens">
        <button onClick={() => tradeForToken(0)}>Golden Key</button>
        <button onClick={() => tradeForToken(1)}>Open Chest</button>
        <button onClick={() => tradeForToken(2)}>Collect Gemstone</button>
      </div>
    </div>
  );
}

export default App;
