/**
 * This class represents a shared whiteboard between a tutor and student.
 * 
 * Each user can add items to the whiteboard. Each new item is added on top of
 * the previous top item. The whiteboard must be able to return items in
 * the order they were added, i.e. from bottom to top, so they can be painted
 * on the screen.
 * 
 * Each item is an object with keys `id`, `lowerId` and `data`.
 * Items are ordered by chaining together based on `id` and `lowerId`, like a linked list.
 * The first item added by a user (the bottom item) is the item with undefined `lowerId`.
 * The second item added by a user is the item with `lowerId` equal to the `id` of the bottom item.
 * And so on.
 */
export class Whiteboard {
    /**
     * Create a whiteboard and add a set items which have been loaded from the database.
     * 
     * @param items an array of items to add to the whiteboard (not
     *              necessarily sorted in the order they were added by users)
     */
    constructor (items) {
        throw new Error("Not implemented");
    }

    /**
     * Return all items that are on the whiteboard, sorted in the order they were added by users
     * i.e. from bottom to top.
     */
    items () {
        throw new Error("Not implemented");
    }

    /**
     * Return the top item, i.e. the item most recently added to the whiteboard
     */
    top () {
        throw new Error("Not implemented");
    }

    /**
     * Add an item to the whiteboard.
     * The `id` of the item being added must not match the `id` of any existing item on the whiteboard.
     * The `lowerId` of the item being added must match the `id` of the current top item.
     * 
     * @param item The item to be added.
     */
    add (item) {
        throw new Error("Not implemented");
    }

    /**
     * Extract a subset of items to be placed on the clipboard.
     * 
     * Given a subset of items that already exist on the whiteboard (e.g. as multi-selected by a user),
     * in any order, return duplicates of those items such that:
     *  * The duplicate items each have new unique `id` value
     *  * The duplicate items each have `lowerId` set to either `undefined` (for the first item) or
     *    to match the `id` value of one of the other duplicate items, so that the implied ordering
     *    of the items is the same as the original items appear on the whiteboard.
     * 
     * As an example, suppose we have the follow items on the whiteboard already:
     *  1. `{ id: "dog", lowerId: undefined, data: "square" }`
     *  2. `{ id: "rabbit", lowerId: "dog", data: "triangle" }`
     *  3. `{ id: "cat", lowerId: "rabbit", data: "circle" }`
     *  4. `{ id: "hamster", lowerId: "cat", data: "arrow" }`
     * 
     * Now let us select two items. The user can click on items in any order to select them, and nothing
     * stops them from selecting items which are not immediately on top of each other, so let our example 
     * selection be items with `id` `rabbit` and `hamster`.
     * 
     * To copy this selection to the clipboard we want to "extract" a duplicate of the items, updating the
     * `id` and `lowerId` so they have new unique values and that the ordering implied by `lowerId` matches
     * the order they appear on the whiteboard (so in the order `rabbit`, `hamster`).
     * 
     * So if in this example we give the duplicate of item with `id` `rabbit` a new unique `id` of `donkey`, and the
     * item with `id` `hamster` a new unique `id` of `chicken`, then we would put on the clipboard:
     *  * `{ id: "chicken", lowerId: "donkey", data: "arrow" }`
     *  * `{ id: "donkey", lowerId: undefined, data: "triangle" }`
     * 
     * The order of these objects on the clipboard is not important, only that the `lowerId` relationship is correct.
     * 
     * @param items subset of items which already exist on this whiteboard
     */
    extract (items) {
        throw new Error("Not implemented");
    }
}
