import { IWPMenu, IMenuItem } from '@srcTypes/models';
import { isArray, sizeOf } from '@util/core.util';

/**
 * find postType in the the given menu.
 * @param wpMenu menu with all items in it.
 * @param postType post type.
 */
export const findPostType = (wpMenu: IWPMenu, postType: string): string | undefined => {
  const { postTypes } = wpMenu
  let menuItem: string | undefined
  if (sizeOf(postTypes) > 0 && isArray(postTypes)) {
    for (let index = 0; index < postTypes.length; index++) {
      if (postTypes[index] === postType) {
        menuItem = postTypes[index]
        break;
      }
    }
  }

  return menuItem
}

/**
 * Use wordpresss route slug to search the page from the menu.
 * @param wpMenu menu with all items in it.
 * @param routeSlug the route slug of the page to find.
 */
export const findPage = (wpMenu: IWPMenu, routeSlug: string): IMenuItem | undefined => {
  const { menu } = wpMenu
  let menuItem: IMenuItem | undefined
  if (sizeOf(menu) > 0 && isArray(menu)) {
    for (let index = 0; index < menu.length; index++) {
      if (menu[index].slug === routeSlug) {
        menuItem = menu[index]
        break;
      }
    }
  }

  return menuItem
}
