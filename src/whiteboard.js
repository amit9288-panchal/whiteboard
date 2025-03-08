/**
 * This class represents a shared whiteboard between a tutor and student.
 *
 * Each user can add items to the whiteboard. Each new item is added on top of
 * the previous top item. The whiteboard must be able to return items in
 * the order they were added, i.e., from bottom to top, so they can be painted
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
    constructor(items) {
        this.itemsList = [];
        const itemMap = new Map();

        /**
         * Validate unique IDs and create map
         */
        items.forEach(item => {
            if (itemMap.has(item.id)) {
                throw new Error(`Item with id ${item.id} already exists.`);
            }
            itemMap.set(item.id, item);
        });

        /**
         * Check lowerId existence and detect cycles
         * @type {Set<any>}
         */
        const visited = new Set();
        const checkCycle = (item) => {
            if (visited.has(item.id)) {
                throw new Error(`Cycle detected involving item ${item.id}.`);
            }
            visited.add(item.id);
            if (item.lowerId && itemMap.has(item.lowerId)) {
                checkCycle(itemMap.get(item.lowerId));
            }
            visited.delete(item.id);
        };

        items.forEach(item => {
            if (item.lowerId && !itemMap.has(item.lowerId)) {
                throw new Error(`Item with lowerId ${item.lowerId} does not exist.`);
            }
            checkCycle(item);
        });

        /**
         * Restructure the list in order
         * @type {*[]}
         */
        const orderedItems = [];
        const addedItems = new Set();

        const addItemToOrder = (item) => {
            if (addedItems.has(item.id)) return;
            if (item.lowerId) {
                const lowerItem = itemMap.get(item.lowerId);
                if (lowerItem) addItemToOrder(lowerItem);
            }
            orderedItems.push(item);
            addedItems.add(item.id);
        };

        items.forEach(item => addItemToOrder(item));

        this.itemsList = orderedItems;
    }

    /**
     * Return all items that are on the whiteboard, sorted in the order they were added by users,
     * i.e., from bottom to top.
     */
    items() {
        return [...this.itemsList];
    }

    /**
     * Return the top item, i.e., the item most recently added to the whiteboard
     */
    top() {
        return this.itemsList[this.itemsList.length - 1] || undefined;
    }

    /**
     * Add an item to the whiteboard.
     * The `id` of the item being added must not match the `id` of any existing item on the whiteboard.
     * The `lowerId` of the item being added must match the `id` of the current top item.
     *
     * @param item The item to be added.
     */
    add(item) {
        if (this.itemsList.some(existingItem => existingItem.id === item.id)) {
            throw new Error(`Item with id ${item.id} already exists.`);
        }
        if (this.top() && this.top().id !== item.lowerId) {
            throw new Error(`Item with lowerId ${item.lowerId} does not match the current top item.`);
        }
        this.itemsList.push(item);
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
    extract(items) {

        const extractedItems = items.map(item => {
            const existingItem = this.itemsList.find(existing => existing.id === item.id);
            if (!existingItem) {
                throw new Error(`Item with id ${item.id} does not exist on the whiteboard.`);
            }
            return {...existingItem, id: this.generateUniqueId(), lowerId: undefined};
        });

        for (let i = 1; i < extractedItems.length; i++) {
            extractedItems[i].lowerId = extractedItems[i - 1].id;
        }

        return extractedItems;
    }

    generateUniqueId() {
        return `id_${Math.random().toString(36).slice(2, 11)}`;
    }
}

/*
const items = [
    {id: 'dog', lowerId: undefined, data: 'hello'},
    {id: 'cat', lowerId: 'dog', data: 'meow'},
    {id: 'rabbit', lowerId: 'cat', data: 'hop'}
]
const whiteboard = new Whiteboard(items);
console.log(whiteboard.items()); // Items from bottom to top

whiteboard.add({id: 'hamster', lowerId: 'rabbit', data: 'squeak'});
console.log(whiteboard.top()); // { id: 'hamster', lowerId: 'rabbit', data: 'squeak' }
console.log(whiteboard.items());

const extracted = whiteboard.extract([
    {id: 'rabbit', lowerId: 'cat', data: 'hop'},
    {id: 'hamster', lowerId: 'rabbit', data: 'squeak'}
]);
console.log(extracted); // Extracted items with new IDs
*/

