return {
  {
    'opdavies/toggle-checkbox.nvim',
    config = function()
      vim.keymap.set('n', '<leader>tt', require('toggle-checkbox').toggle)
    end,
  },
}
