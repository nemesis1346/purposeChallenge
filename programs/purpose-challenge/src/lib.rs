use anchor_lang::prelude::*;

declare_id!("9aTf53g8P77aop423jgNCL7hapZ2drU7bnPJxuuudZqe");

#[program]
pub mod purpose_challenge {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
