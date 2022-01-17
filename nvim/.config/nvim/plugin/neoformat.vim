augroup fmt
  autocmd!
  autocmd BufWritePre *.js,*.jsx,*.ts,*.tsx Neoformat
augroup END

nnoremap <leader>p :Neoformat<cr>
