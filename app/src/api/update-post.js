import { useWorkspace } from '@/composables'

export const updatePost = async (post, topic, content) => {
    const { wallet, program } = useWorkspace()
    await program.value.rpc.updatePost(topic, content, {
        accounts: {
            author: wallet.value.publicKey,
            post: post.publicKey,
        },
    })

    post.topic = topic
    post.content = content
}
