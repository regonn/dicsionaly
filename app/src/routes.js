export default [
    {
        name: 'Home',
        path: '/',
        component: require('@/components/PageHome').default,
    },
    {
        name: 'Address',
        path: '/address/:topic?',
        component: require('@/components/PageTopics').default,
    },
    {
        name: 'Authors',
        path: '/authors/:author?',
        component: require('@/components/PageUsers').default,
    },
    {
        name: 'Post',
        path: '/post/:post',
        component: require('@/components/PagePost').default,
    },
    {
        name: 'NotFound',
        path: '/:pathMatch(.*)*',
        component: require('@/components/PageNotFound').default,
    },
]
