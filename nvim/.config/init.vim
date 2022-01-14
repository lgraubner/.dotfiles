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

set tabstop=4
set shiftwidth=4
set expandtab

let mapleader = " "

