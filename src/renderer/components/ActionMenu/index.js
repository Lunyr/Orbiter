import React from 'react';
import PropTypes from 'prop-types';
import injectStyles from 'react-jss';
import {
  Wrapper,
  Button as ARIAButton,
  Menu as ARIAMenu,
  MenuItem as ARIAItem,
} from 'react-aria-menubutton';
import cx from 'classnames';
import { MdArrowDropDown as DropdownArrow } from 'react-icons/md';
import styles from './styles';

/**
 * ActionMenu
 * Component that returns a "popver" menu that is triggered by a button interaction.
 * Menu items are defined by `children` living within the component declaration.
 *
 * Note:
 * There is a convention here where the first child is the `button/trigger` reference and
 * subsequent children are the menu items
 *
 * e.g,
 * <ActionMenu><div>Trigger Here</div><div>Menu Item 1</div></ActionMenu>
 */
const ActionMenu = ({
  alignedRight,
  arrow,
  buttonClassName,
  className,
  classes,
  id,
  itemHeight,
  onSelected,
  children: [button, ...menuItems],
}) => (
  <Wrapper id={id} className={cx(classes.container, className)} onSelection={onSelected}>
    <ARIAButton className={cx(classes.button, buttonClassName)}>
      {button}
      <DropdownArrow size={20} />
    </ARIAButton>
    <ARIAMenu
      className={cx(classes.menu, arrow && alignedRight ? classes.arrowRight : classes.arrowLeft)}>
      <ul className={classes.list}>
        {React.Children.map(menuItems, (item, index) => {
          if (item) {
            return (
              <li key={index}>
                <ARIAItem className={classes.item} style={{ height: itemHeight }}>
                  {item}
                </ARIAItem>
              </li>
            );
          }
        })}
      </ul>
    </ARIAMenu>
  </Wrapper>
);

ActionMenu.defaultProps = {
  alignedRight: false,
  arrow: true,
  itemHeight: 40,
  width: 250,
};

ActionMenu.propTypes = {
  alignedRight: PropTypes.bool.isRequired,
  arrow: PropTypes.bool.isRequired,
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  id: PropTypes.string,
  itemHeight: PropTypes.number.isRequired,
  onSelected: PropTypes.func,
  width: PropTypes.number.isRequired,
};

export default injectStyles(styles)(ActionMenu);
