import { useWorkspace, usePagination } from '@/composables'
import { Post } from '@/models'
import { BN } from '@project-serum/anchor'
import { computed, ref } from 'vue'

export const paginatePosts = (filters = [], perPage = 6, onNewPage = () => {}) => {
    filters = ref(filters)
    const { program, connection } = useWorkspace()
    const page = ref(0)

    const prefetchCb = async () => {
        // Reset page number.
        page.value = 0

        // Prepare the discriminator filter.
        const postClient = program.value.account.post
        const postAccountName = postClient._idlAccount.name
        const postDiscriminatorFilter = {
            memcmp: postClient.coder.accounts.memcmp(postAccountName)
        }

        // Prefetch all tweets with their timestamps only.
        const allPosts = await connection.getProgramAccounts(program.value.programId, {
            filters: [postDiscriminatorFilter, ...filters.value],
            dataSlice: { offset: 40, length: 8 },
        })

        // Parse the timestamp from the account's data.
        const allPostsWithTimestamps = allPosts.map(({ account, pubkey }) => ({
            pubkey,
            timestamp: new BN(account.data, 'le'),
        }))

        return allPostsWithTimestamps
            .sort((a, b) => b.timestamp.cmp(a.timestamp))
            .map(({ pubkey }) => pubkey)
    }

    const pageCb = async (page, paginatedPublicKeys) => {
        const upvoteClient = program.value.account.upvote
        const upvoteAccountName = upvoteClient._idlAccount.name
        const upvoteDiscriminatorFilter = {
            memcmp: upvoteClient.coder.accounts.memcmp(upvoteAccountName)
        }

        const allUpvotes = await connection.getProgramAccounts(program.value.programId, {
            filters: [upvoteDiscriminatorFilter, ...filters.value],
            dataSlice: { offset: 40, length: 8 },
        })

        console.log(allUpvotes)
        console.log(paginatedPublicKeys)
        const posts = await program.value.account.post.fetchMultiple(paginatedPublicKeys)

        return posts.reduce((accumulator, post, index) => {
            const publicKey = paginatedPublicKeys[index]
            accumulator.push(new Post(publicKey, post))
            return accumulator
        }, [])
    }

    const pagination = usePagination(perPage, prefetchCb, pageCb)
    const { hasPage, getPage } = pagination

    const hasNextPage = computed(() => hasPage(page.value + 1))
    const getNextPage = async () => {
        const newPagePosts = await getPage(page.value + 1)
        page.value += 1
        onNewPage(newPagePosts)
    }

    return { page, hasNextPage, getNextPage, ...pagination }
}

export const authorFilter = authorBase58PublicKey => ({
    memcmp: {
        offset: 8, // Discriminator.
        bytes: authorBase58PublicKey,
    }
})

export const topicFilter = topic => ({
    memcmp: {
        offset: 8 + // Discriminator.
            32 + // Author public key.
            8, // Timestamp.
        bytes: topic,
    }
})
