import { ElNotification } from 'element-plus';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import ABI from './BLOCK-BACK_ABI.json';
import ERC20_ABI from './ERC20_ABI.json';

export const contractAddress = '0x283DE3Ca7B88dff5f93EdA6c5A450f3D1e237b9b';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum!)
});

export const requestAccess = async () => {
  if (!window.ethereum) {
    ElNotification({ title: 'Error', message: 'Metamask not found', type: 'error' });
    throw new Error('Metamask not found');
  }

  await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }] // Sepolia
  });
};

export const getClientAddress = async (): Promise<any> => {
  if (!window.ethereum) throw new Error('Metamask not found');

  const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return address;
};

export const sendContractTx = async (functionName: string, args?: any[]) => {
  const address = await getClientAddress();

  const { request } = await publicClient.simulateContract({
    account: address,
    address: contractAddress,
    abi: ABI,
    functionName,
    args
  });

  return await walletClient.writeContract(request);
};

export const readContract = async (functionName: string, args?: any[]) => {
  const address = await getClientAddress();

  const request = await publicClient.readContract({
    account: address,
    address: contractAddress,
    abi: ABI,
    functionName,
    args
  });

  return request;
};

const USDCAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8';

export const isContractApproved = async (address: string) => {
  const allowedTokens = await publicClient.readContract({
    address: USDCAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address, contractAddress]
  });
  console.log(allowedTokens)
  return (allowedTokens as bigint) > 0n;
};

export const allowContract = async (address: any) => {
  const contractStatus = await isContractApproved(address);

  if (contractStatus) return;

  const { request: approveResult } = await publicClient.simulateContract({
    account: address,
    address: USDCAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [contractAddress, 10000000000]
  });

  await walletClient.writeContract(approveResult as any);
};
