# Renderer

### `components`

The "pure" react components. Stateless and reuseable components across the application.

### `containers`

The react components "connected" into the redux app-state. These components will be stateful and
control the underlying children which can be stateless or other container components.

e.g, A typical export will look like,

`export default connect(mapStateToProps, mapDispatchToProps)(ContainerComponent)`

### `lib`

Useful APIs that expose some packaged functionality.

### `theme`

The core style map for the application. Exports a single map object that can be used directly with
`react-jss`.

The theme is injected into the `ThemeProvider` component and used in a HOC fashion by wrapping a
component with `injectStyles`. This will add the `classes` prop into the component to use.

e.g,

```
const Component = ({ classes }) => (
  <div className={classes.container}>Stuff</div>
);

const styles = theme => ({
  container: {
    height: '100%',
    width: '100%',
    background: theme.colors.black
  }
});

export default injectStyles(styles)(Component)
```
