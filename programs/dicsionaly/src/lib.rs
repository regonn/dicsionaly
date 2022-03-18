use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("HzTE8qTtPxhTN2kzSCpfY9FSbYt8rt72pgBzinbUMKbL");

#[program]
pub mod dicsionaly {
    use super::*;

    pub fn submit_post(ctx: Context<SubmitPost>, target: Pubkey, comment: String) -> ProgramResult {
        let post: &mut Account<Post> = &mut ctx.accounts.post;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        post.author = *author.key;
        post.timestamp = clock.unix_timestamp;
        post.target = target;
        post.comment = comment;

        Ok(())
    }

    pub fn submit_upvote(
        ctx: Context<SubmitUpvote>,
        target: Pubkey,
        post_pubkey: Pubkey,
    ) -> ProgramResult {
        let upvote: &mut Account<Upvote> = &mut ctx.accounts.upvote;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        upvote.author = *author.key;
        upvote.timestamp = clock.unix_timestamp;
        upvote.target = target;
        upvote.post_pubkey = post_pubkey;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SubmitPost<'info> {
    #[account(init, payer = author, space = Post::LEN)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    /// CHECK: OK
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SubmitUpvote<'info> {
    #[account(init, payer = author, space = Upvote::LEN)]
    pub upvote: Account<'info, Upvote>,
    #[account(mut)]
    pub author: Signer<'info>,
    /// CHECK: OK
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[account]
pub struct Upvote {
    pub author: Pubkey,
    pub timestamp: i64,
    pub target: Pubkey,
    pub post_pubkey: Pubkey,
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub timestamp: i64,
    pub target: Pubkey,
    pub comment: String,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_COMMENT_LENGTH: usize = 280 * 4; // 280 chars max.

impl Post {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp.
        + PUBLIC_KEY_LENGTH // Target.
        + STRING_LENGTH_PREFIX + MAX_COMMENT_LENGTH; // Comment.
}

impl Upvote {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp.
        + PUBLIC_KEY_LENGTH // Target.
        + PUBLIC_KEY_LENGTH; // PostPubkey.
}
