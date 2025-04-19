use anchor_lang::prelude::*;

declare_id!("9aTf53g8P77aop423jgNCL7hapZ2drU7bnPJxuuudZqe");

#[program]
pub mod name_storage {
    use super::*;

    pub fn store_name(ctx: Context<StoreName>, name: String) -> Result<()> {
        let name_account = &mut ctx.accounts.name_account;
        name_account.name = name;
        Ok(())
    }

    pub fn get_name(ctx: Context<GetName>) -> Result<String> {
        Ok(ctx.accounts.name_account.name.clone())
    }
}

#[derive(Accounts)]
pub struct StoreName<'info> {
    #[account(init, payer = user, space = 8 + 32)]
    pub name_account: Account<'info, NameAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetName<'info> {
    #[account()]
    pub name_account: Account<'info, NameAccount>,
}

#[account]
pub struct NameAccount {
    pub name: String,
}