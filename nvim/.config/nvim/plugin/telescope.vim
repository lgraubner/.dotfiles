nnoremap <leader>ff <cmd>Telescope find_files<cr>
nnoremap <leader>fg <cmd>Telescope live_grep<cr>
nnoremap <leader>fb <cmd>Telescope buffers<cr>
" nnoremap <leader>fgb <cmd>Telescope git_branches<cr>
" nnoremap <leader>fgs <cmd>Telescope git_status<cr>
" nnoremap <leader>fgc <cmd>Telescope git_commits<cr>

lua << EOF
  local telescope = require('telescope')
  telescope.setup({
    pickers = {
      find_files = {
        hidden = true,
        file_ignore_patterns = {'.git/.*', '.DS_Store'}
      },
      buffers = {
        sort_lastused = true,
        mappings = {
          i = {
            ["<c-d>"] = "delete_buffer"
          }
        }
      }
    }
  })
EOF
