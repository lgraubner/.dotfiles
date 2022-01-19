call plug#begin()
" color scheme
Plug 'arcticicestudio/nord-vim'

" indentation
Plug 'tpope/vim-sleuth'
" commenting
Plug 'tpope/vim-commentary'

" language server
Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'hrsh7th/cmp-buffer'
Plug 'hrsh7th/nvim-cmp'
Plug 'L3MON4D3/LuaSnip'

" treesitter
Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}

" telescope fuzzy finder
Plug 'nvim-lua/plenary.nvim'
Plug 'nvim-telescope/telescope.nvim'
Plug 'nvim-telescope/telescope-fzy-native.nvim'

" prettier
Plug 'sbdchd/neoformat'

call plug#end()

colorscheme nord

set number relativenumber

set fileencoding=utf-8

set tabstop=4 softtabstop=4
set shiftwidth=4
set expandtab
set smartindent

set nowrap

set hidden

set scrolloff=8

set colorcolumn=80
set signcolumn=yes

let mapleader = " "

" more intuitive chapter up/down
nnoremap <C-j> <C-d>
nnoremap <C-k> <C-u>

" undo breakpoints
inoremap , ,<c-g>u
inoremap . .<c-g>u
inoremap ! !<c-g>u
inoremap ? ?<c-g>u

" moving text
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv
inoremap <C-j> <esc>:m .+1<CR>==gi
inoremap <C-k> <esc>:m .-2<CR>==gi
nnoremap <leader>j :m .+1<CR>==
nnoremap <leader>k :m .-2<CR>==

" faster buffer navigation
nnoremap <leader>bn :bn<CR>
nnoremap <leader>bp :bp<CR>

" create new line without entering insert mode
nmap <leader>o m`o<Esc>``
nmap <leader>O m`O<esc>``

" highlight yank
augroup highlight_yank
    autocmd!
    autocmd TextYankPost * silent! lua require'vim.highlight'.on_yank({timeout = 100})
augroup END

