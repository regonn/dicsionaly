<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { topicFilter } from '@/api'
import { useFromRoute } from '@/composables'
import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'
import PostSearch from '@/components/PostSearch'

// Data.
const router = useRouter()
const posts = ref([])
const topic = ref('')
const viewedTopic = ref('')
const filters = ref([])


// Actions.
const search = () => {
    router.push(`/topics/${topic.value}`)
}

const fetchTopicPosts = () => {
    if (topic.value === viewedTopic.value) return;
    console.log(topic.value)
    posts.value = []
    viewedTopic.value = topic.value
    
    filters.value = [topicFilter(topic.value)]
}

const addPost = post => posts.value.push(post)

// Router hooks.
useFromRoute((route) => {
    console.log(route.params.topic)
    topic.value = route.params.topic
    if (topic.value) {
        fetchTopicPosts()
    } else {
        posts.value = []
        viewedTopic.value = ''
    }
})
</script>

<template>
    <post-search placeholder="solana address" :disabled="! topic" v-model="topic" @search="search">
        <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clip-rule="evenodd" />
            </svg>  
        </template>
    </post-search>
    <div v-if="viewedTopic">
        <post-form @added="addPost" :forced-topic="viewedTopic"></post-form>
        <post-list v-model:posts="posts" :loading="loading" :has-more="hasNextPage" @more="getNextPage"></post-list>
        <div v-if="!loading && posts.length === 0" class="p-8 text-gray-500 text-center">
            No posts were found in this topic...
        </div>
    </div>
</template>
