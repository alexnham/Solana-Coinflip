use anchor_lang::prelude::*;


#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub state: u8
}
