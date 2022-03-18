import { web3 } from "@project-serum/anchor";
import { useWorkspace } from "@/composables";
import { Upvote } from "@/models";

export const submitUpvote = async (target, post_pubkey) => {
  console.log(target)
  console.log(post_pubkey)
  const { wallet, program } = useWorkspace();
  const upvote = web3.Keypair.generate();

  const targetPublicKey = new web3.PublicKey(target);
  const postPublicKey = new web3.PublicKey(post_pubkey);

  await program.value.rpc.submitUpvote(targetPublicKey, postPublicKey, {
    accounts: {
      author: wallet.value.publicKey,
      upvote: upvote.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [upvote],
  });

  const upvoteAccount = await program.value.account.upvote.fetch(upvote.publicKey);
  return new Upvote(upvote.publicKey, upvoteAccount);
};
