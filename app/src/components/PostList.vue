<script setup>
import { computed, toRefs } from 'vue'
import PostCard from '@/components/PostCard'

const props = defineProps({
    posts: Array,
    loading: Boolean,
    hasMore: Boolean,
})

const { posts, loading, hasMore } = toRefs(props)
const orderedPosts = computed(() => {
    return posts.value.slice().sort((a, b) => b.timestamp - a.timestamp)
})

</script>

<template>
    <div class="divide-y">
        <post-card v-for="post in orderedPosts" :key="post.key" :post="post" @delete="onDelete"></post-card>
        <div v-if="loading" class="p-8 text-gray-500 text-center">
            Loading...
        </div>
        <div v-else-if="hasMore" class="p-8 text-center">
            <button @click="emit('more')" class="px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                Load more
            </button>
        </div>
    </div>
</template>
