import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Dicsionaly } from "../target/types/dicsionaly";
import * as assert from "assert";

describe("dicsionaly", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  let target = new anchor.web3.PublicKey(
    "5EokWwrE59VvYsWJTvveXKLhmQTcRbVEp1MS7D15SNwW"
  );
  console.log(target);

  const program = anchor.workspace.Dicsionaly as Program<Dicsionaly>;

  it("can submit and upvote a post", async () => {
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(
      otherUser.publicKey,
      1000000000
    );
    const post = anchor.web3.Keypair.generate();
    const upvote = anchor.web3.Keypair.generate();

    await program.rpc.submitPost(target, "comment", {
      accounts: {
        post: post.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [post],
    });

    const postAccount = await program.account.post.fetch(post.publicKey);
    assert.equal(
      postAccount.author.toBase58(),
      program.provider.wallet.publicKey.toBase58()
    );

    await program.rpc.submitUpvote(target, post.publicKey, {
      accounts: {
        upvote: upvote.publicKey,
        author: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [otherUser, upvote],
    });

    const upvoteAccount = await program.account.upvote.fetch(upvote.publicKey);
    assert.equal(
      upvoteAccount.author.toBase58(),
      otherUser.publicKey.toBase58()
    );
  });
});
