return {
  {
    'epwalsh/pomo.nvim',
    version = '*', -- Recommended, use latest release instead of latest commit
    lazy = true,
    cmd = { 'TimerStart', 'TimerRepeat' },
    dependencies = {
      -- Optional, but highly recommended if you want to use the "Default" timer
      -- 'rcarriga/nvim-notify',
    },
    opts = {
      -- The "System" notifier sends a system notification when the timer is finished.
      -- Available on MacOS natively and Linux via the `libnotify-bin` package.
      -- Tracking: https://github.com/epwalsh/pomo.nvim/issues/3
      notifiers = {
        { name = 'System' },
      },
    },
  },
}
