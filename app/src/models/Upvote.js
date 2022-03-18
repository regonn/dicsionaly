import dayjs from "dayjs"

export class Upvote
{
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.target = accountData.target
        this.post_pubkey = accountData.post_pubkey
    }

    get publickey_display () {
        return this.publicKey.toBase58()
    }

    get author_display () {
        return this.author.toBase58()
    }

    get target_display () {
        return this.target.toBase58()
    }

    get post_pubkey_display () {
        return this.post_pubkey.toBase58()
    }

    get created_at () {
        return dayjs.unix(this.timestamp).format('lll')
    }

    get created_ago () {
        return dayjs.unix(this.timestamp).fromNow()
    }
}
