return {
  {
    'nvim-lualine/lualine.nvim',
    dependencies = { 'nvim-tree/nvim-web-devicons' },
    config = function()
      require('lualine').setup {
        options = {
          icons_enabled = false,
          theme = 'auto',
          component_separators = '',
          section_separators = '',
        },
        sections = {
          lualine_x = {
            function()
              local ok, pomo = pcall(require, 'pomo')
              if not ok then
                return ''
              end

              local timer = pomo.get_first_to_finish()
              if timer == nil then
                return ''
              end

              return tostring(timer)
            end,
            'encoding',
            'filetype',
          },
        },
      }
    end,
  },
}
