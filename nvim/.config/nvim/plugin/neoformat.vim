let g:neoformat_try_node_exe = 1

augroup fmt
  autocmd!
  autocmd BufWritePre *.js,*.jsx,*.ts,*.tsx,*.json Neoformat
augroup END

nnoremap <leader>p :Neoformat<cr>

" use prettier for javascript formatting
let g:neoformat_enabled_javascript = ['prettier']
let g:neoformat_enabled_json = ['prettier']
