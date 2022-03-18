<script setup>
import { ref } from 'vue'
import { paginatePosts } from '@/api'
import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'
const posts = ref([])
const onNewPage = newPosts => posts.value.push(...newPosts)
const { prefetch, hasNextPage, getNextPage, loading } = paginatePosts([], 10, onNewPage)
prefetch().then(getNextPage)
const addPost = post => posts.value.push(post)
</script>

<template>
    <post-form @added="addPost"></post-form>
    <post-list v-model:posts="posts" :loading="loading" :has-more="hasNextPage" @more="getNextPage"></post-list>
</template>