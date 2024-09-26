import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Cpu, BarChart2, Zap, Wallet } from 'lucide-react'
import { Input } from "@/components/ui/input"

export default function ImprovedMiningApp() {
  const [balance, setBalance] = useState(0);
  const [miningPower, setMiningPower] = useState(0.001);
  const [isMining, setIsMining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastMined, setLastMined] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [upgradeCost, setUpgradeCost] = useState(1);
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const addLog = (message: string) => {
    setLogs(prevLogs => [message, ...prevLogs.slice(0, 4)]);
  };

  const startMining = () => {
    const now = Date.now();
    if (now - lastMined < 5000) {
      addLog("ERROR: Mining cooldown active. Hack attempt detected!");
      return;
    }
    setIsMining(true);
    setProgress(0);
    addLog("INITIATING: Mining process started...");
  };

  const upgradeMiningRig = () => {
    if (balance >= upgradeCost) {
      setBalance(prevBalance => prevBalance - upgradeCost);
      setMiningPower(prevPower => prevPower * 1.5);
      setUpgradeCost(prevCost => prevCost * 2);
      addLog(`UPGRADE: Mining rig enhanced. New power: ${(miningPower * 1.5).toFixed(5)} HTC/mine`);
    } else {
      addLog("ERROR: Insufficient funds for upgrade. Nice try, h4x0r!");
    }
  };

  const connectWallet = () => {
    if (walletAddress.trim() !== '') {
      setIsWalletConnected(true);
      addLog(`SUCCESS: Wallet connected - ${walletAddress}`);
    } else {
      addLog("ERROR: Invalid wallet address. Try again, h4x0r!");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining) {
      interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            setIsMining(false);
            const minedAmount = miningPower * (1 + Math.random() * 0.5);
            setBalance(prevBalance => prevBalance + minedAmount);
            setLastMined(Date.now());
            addLog(`SUCCESS: Mined ${minedAmount.toFixed(8)} HTC`);
            return 0;
          }
          return prevProgress + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isMining, miningPower]);

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono">
      <h1 className="text-3xl mb-4 text-center">HackerMiner v2.0</h1>
      <Tabs defaultValue="mine" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mine">Mine</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="mr-2" />
                Mining Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={startMining}
                disabled={isMining}
                className="w-full bg-green-700 hover:bg-green-600 text-black mb-4"
              >
                {isMining ? 'Mining in progress...' : 'Start Mining'}
              </Button>
              {isMining && (
                <div>
                  <Progress value={progress} className="mb-2" />
                  <div className="text-xs">Hacking progress: {progress}%</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upgrade">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2" />
                Upgrade Mining Rig
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">Current Mining Power: {miningPower.toFixed(5)} HTC/mine</div>
              <div className="mb-4">Upgrade Cost: {upgradeCost.toFixed(8)} HTC</div>
              <Button
                onClick={upgradeMiningRig}
                disabled={balance < upgradeCost}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-black"
              >
                Upgrade Mining Rig
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2" />
                Connect Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isWalletConnected ? (
                <div>
                  <div className="mb-4">Connected Wallet: {walletAddress}</div>
                  <Button
                    onClick={() => setIsWalletConnected(false)}
                    className="w-full bg-red-600 hover:bg-red-500 text-black"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div>
                  <Input
                    type="text"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="mb-4"
                  />
                  <Button
                    onClick={connectWallet}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-black"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2" />
                Hacker Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">Balance: {balance.toFixed(8)} HTC</div>
              <div className="mb-2">Mining Power: {miningPower.toFixed(5)} HTC/mine</div>
              <div>Last Mined: {new Date(lastMined).toLocaleTimeString()}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="mt-4 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2" />
            Hacker Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="font-bold">
                {log}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-xs max-w-3xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="overflow-hidden whitespace-nowrap">
            {Math.random().toString(36).substring(2, 38)}
          </div>
        ))}
      </div>
    </div>
  );
}
