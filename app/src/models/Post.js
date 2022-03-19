import dayjs from "dayjs"

export class Post
{
    constructor (publicKey, accountData, upvoteCount = 0) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.target = accountData.target
        this.comment = accountData.comment
        this.upvoteCount = upvoteCount
    }

    get key () {
        return this.publicKey.toBase58()
    }

    get author_display () {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }

    get target_display () {
        return this.target.toBase58()
    }

    get created_at () {
        return dayjs.unix(this.timestamp).format('lll')
    }

    get created_ago () {
        return dayjs.unix(this.timestamp).fromNow()
    }

    get upvote_count () {
        return this.upvoteCount
    }
}
