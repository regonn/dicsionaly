<script setup>
import { ref, toRefs, computed } from 'vue'
import { useWorkspace } from '@/composables'
import { submitUpvote } from '@/api'

const props = defineProps({
    post: Object,
})

const { post } = toRefs(props)
const { wallet } = useWorkspace()
const isMyPost = computed(() => wallet.value && wallet.value.publicKey.toBase58() === post.value.author.toBase58())
const authorRoute = computed(() => {
    return { name: 'Authors', params: { author: post.value.author.toBase58() } }
})

const isEditing = ref(false)

const send = async (post_data) => {
    console.log(post_data)
    await submitUpvote(post_data.target_display, post_data.key)
}

</script>

<template>
    <post-form-update v-if="isEditing" :post="post" @close="isEditing = false"></post-form-update>
    <div class="px-8 py-4" v-else>
        <div class="flex justify-between">
            <div class="py-1">
                <h3 class="inline font-semibold" :title="post.author">
                    <router-link :to="authorRoute" class="hover:underline">
                        {{ post.author_display }}
                    </router-link>
                </h3>
                <span class="text-gray-500"> • </span>
                <time class="text-gray-500 text-sm" :title="post.created_at">
                    <router-link :to="{ name: 'Post', params: { post: post.publicKey.toBase58() } }" class="hover:underline">
                        {{ post.created_ago }}
                    </router-link>
                </time>
            </div>
            <div class="flex" v-if="isMyPost">
            </div>
            <div class="flex" v-else>
                <button @click="send(post)" class="text-white px-4 py-2 rounded-full font-semibold bg-purple-500" title="Upvote">
                    Upvote
                </button>
            </div>
        </div>
        <p class="whitespace-pre-wrap break-all" v-text="post.comment"></p>
        <p class="whitespace-pre-wrap break-all" v-text="post.target_display"></p>
        <router-link v-if="post.topic" :to="{ name: 'Topics', params: { topic: post.topic } }" class="inline-block mt-2 text-purple-500 hover:underline break-all">
            #{{ post.target_display }}
        </router-link>
    </div>
</template>
