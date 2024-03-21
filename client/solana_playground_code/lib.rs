use anchor_lang::prelude::*;

pub mod states;
pub mod constant;
use crate::{constant::*, states::*};
declare_id!("");

#[program]
pub mod coinflip {
    use super::*;
    //initalize user
    //add a USER PROFILE to the block chain
    //set default data
    pub fn init_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;

        user_profile.authority = ctx.accounts.authority.key();
        user_profile.state = 0;
        Ok(())
    }
    pub fn set_user(ctx: Context<SetState>, change_state: u8) -> Result<()> {
        //mark todo
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.state = change_state;

        Ok(())
    }
    
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG,authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(change_state:u8)]
pub struct SetState<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}