vim.go.neoformat_try_node_exe = 1

local format_group = vim.api.nvim_create_augroup('fmt', { clear = true })
vim.api.nvim_create_autocmd('BufWritePre', {
  command = 'Neoformat',
  group = format_group,
  pattern = '*.js,*.jsx,*.ts,*.tsx,*.json',
})

vim.keymap.set('n', '<leader>p', ':Neoformat<cr>')

-- use prettier for javascript formatting
vim.go.neoformat_enabled_javascript = "['prettier']"
vim.go.neoformat_enabled_json = "['prettier']"

