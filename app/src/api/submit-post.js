import { web3 } from '@project-serum/anchor'
import { useWorkspace } from '@/composables'
import { Post } from '@/models'

export const submitPost = async (target, comment) => {
    const { wallet, program } = useWorkspace()
    const post = web3.Keypair.generate()
    const targetPublicKey = new web3.PublicKey(target)

    await program.value.rpc.submitPost(targetPublicKey, comment, {
        accounts: {
            author: wallet.value.publicKey,
            post: post.publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [post]
    })

    const postAccount = await program.value.account.post.fetch(post.publicKey)
    return new Post(post.publicKey, postAccount)
}
