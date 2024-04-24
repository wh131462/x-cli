export const Examples = `
Examples:
  # Initialize a new project
  $ x new myProject

  # Create a component inside a specific directory
  $ x create component myComponent -d src/App

  # Create a directive
  $ x create directive myDirective

  # Create a pipe
  $ x create pipe myPipe

  # Create a service
  $ x create service myService

  # Create documentation for a component
  $ x create documentation myComponentDoc

  # Remove a component from a specific directory
  $ x remove component myComponent -d src/App

  # Remove a service from a specific directory
  $ x remove service myService -d src/App

  # Remove a directive
  $ x remove directive myDirective

  # Uninstall a plugin
  $ x plugin uninstall myPlugin

  # List installed plugins
  $ x plugin list

  # Update x-cli to the latest stable version
  $ x update

  # Install a dependency as a development dependency
  $ xi myDependency -D

  # Install a dependency globally
  $ xi myDependency -g

  # Uninstall a global dependency
  $ xu myDependency -g

  # Run a script with force
  $ xr myScript -f

  # Run a script without force
  $ xr myScript
`;
