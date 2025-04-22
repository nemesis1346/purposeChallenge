use anchor_lang::prelude::*;

declare_id!("3qJ7i6VosNpuJieRHAywaLjEo8JacU8RSkhxuuG3tPq3");

#[program]
pub mod purpose_challenge {
    use super::*;

    pub fn store_name(ctx: Context<StoreName>, name: String) -> Result<()> {
        ctx.accounts.name_account.name = name;
        Ok(())
    }

    // View function to get the name
    pub fn get_name(ctx: Context<GetName>) -> Result<String> {
        Ok(ctx.accounts.name_account.name.clone())
    }
}

#[derive(Accounts)]
pub struct StoreName<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 4 + 50, // 8 header + 4 bytes for string length + 50 chars
        seeds = [b"name", user.key().as_ref()], // Explicit PDA seeds
        bump
    )]
    pub name_account: Account<'info, NameAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct GetName<'info> {
    #[account()] // No mutability needed for view
    pub name_account: Account<'info, NameAccount>,
}

#[account]
pub struct NameAccount {
    pub name: String,
}