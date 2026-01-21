export const Examples = `
Examples:
  # Create a new project (Vue/React/Angular)
  $ x new my-project

  # Initialize dev tools in current project
  $ x plugin init

  # Install a specific plugin
  $ x plugin install eslint

  # Uninstall a plugin
  $ x plugin uninstall prettier

  # List installed plugins
  $ x plugin list

  # Update x-cli to the latest version
  $ x update

  # Install a dependency
  $ xi lodash

  # Install a dev dependency
  $ xi typescript -D

  # Install a global dependency
  $ xi typescript -g

  # Uninstall a dependency
  $ xu lodash

  # Uninstall a global dependency
  $ xu typescript -g

  # Run a script
  $ xr build

  # Run a script with arguments
  $ xr test --watch
`;
