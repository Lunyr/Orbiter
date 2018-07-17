# Shared

### `redux`

The folder that contains all the setup and configuration for a `redux` application.

Includes the store configuration, middleware, and modules.

The redux store takes on a special form in the electron app. We store a "primary" app-state in the
main process so that we can integrate directly into the local database. We proxy the renderer
app-state by replaying actions into the main process. This is bi-directional but we can also scope
the states by adding a scope.
