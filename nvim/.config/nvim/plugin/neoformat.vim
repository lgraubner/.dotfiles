let g:neoformat_try_node_exe = 1

augroup fmt
  autocmd!
  autocmd BufWritePre *.js,*.jsx,*.ts,*.tsx Neoformat
augroup END

nnoremap <leader>p :Neoformat<cr>
