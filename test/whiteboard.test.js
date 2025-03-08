import { Whiteboard } from "../src/whiteboard";

describe("Whiteboard contstructor", () => {
    test("items can be ordered, does not throw exception", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'hamster', lowerId: 'cat', data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        new Whiteboard(items);
    });

    test("no items, does not throw exception", () => {
        new Whiteboard([]);
    });

    test("no bottom item, throws exception", () => {
        const items = [
            { id: 'dog', lowerId: 'zzz', data: 'hello' },
            { id: 'hamster', lowerId: 'cat', data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        expect(() => { new Whiteboard(items) }).toThrow();
    });

    test("items cannot be ordered, throws exception", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'hamster', lowerId: 'cat', data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'zzz', data: 'hello' }
        ];

        expect(() => { new Whiteboard(items) }).toThrow();
    });
});

describe("top", () => {
    test("no items, returns undefined", () => {
        const whiteboard = new Whiteboard([]);

        expect(whiteboard.top()).toBeUndefined();
    });

    test("at least one item, returns the top most item", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'hamster', lowerId: 'cat', data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        const whiteboard = new Whiteboard(items);

        expect(whiteboard.top()?.id).toBe('hamster');
    });
});

describe("add", () => {
    test("item lowerId does match current top item id, item is added to the top of the whiteboard", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        const whiteboard = new Whiteboard(items);

        whiteboard.add({ id: 'tortoise', lowerId: 'cat', data: 'new' });

        expect(whiteboard.top()?.id).toBe('tortoise');
    });

    test("item lowerId does not match current top item id, throws exception", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        const whiteboard = new Whiteboard(items);

        expect(() => { whiteboard.add({ id: 'tortoise', lowerId: 'rabbit', data: 'new' }); }).toThrow();
    });

    test("item id already exists on the whiteboard, throws exception", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        const whiteboard = new Whiteboard(items);

        expect(() => { whiteboard.add({ id: 'cat', lowerId: 'rabbit', data: 'new' }); }).toThrow();
    });
});

describe("items", () => {
    test("items are returned in visible order from bottom to top", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'hamster', lowerId: 'cat', data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' }
        ];

        const whiteboard = new Whiteboard(items);

        expect(whiteboard.items()).toStrictEqual([
            { id: 'dog', lowerId: undefined, data: 'hello' },
            { id: 'rabbit', lowerId: 'dog', data: 'hello' },
            { id: 'cat', lowerId: 'rabbit', data: 'hello' },
            { id: 'hamster', lowerId: 'cat', data: 'hello' },
        ]);
    });
});

describe("extract", () => {
    test("item ids exist on whiteboard, new items are returned with new ids and lowerIds set so the order is preserved as on the whiteboard", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'ww' },
            { id: 'cat', lowerId: 'rabbit', data: 'xx' },
            { id: 'rabbit', lowerId: 'dog', data: 'yy' },
            { id: 'tortoise', lowerId: 'cat', data: 'zz' }
        ];

        const whiteboard = new Whiteboard(items);

        const extracted = whiteboard.extract([
            { id: 'tortoise', lowerId: 'cat', data: 'zz' },
            { id: 'rabbit', lowerId: 'dog', data: 'yy' }
        ]);

        // the data is the same, in any order
        expect(extracted.length).toBe(2);
        expect(extracted.map(item => item.data)).toContain('yy');
        expect(extracted.map(item => item.data)).toContain('zz');

        // the ids have been changed
        expect(extracted.map(item => item.id)).not.toContain('tortoise');
        expect(extracted.map(item => item.id)).not.toContain('rabbit');
        
        // the lowerIds have been set correctly
        // one item has lowerId === undefined (the bottom item)
        expect(extracted.filter(item => item.lowerId === undefined)).toHaveLength(1);
        // the other item has lowerId === the new id of the bottom item
        expect(extracted.map(item => item.lowerId)).toContain(extracted.find(item => item.lowerId === undefined)?.id);
    });

    test("references to items on the whiteboard, existing items are not mutated", () => {
        const tortoise = { id: 'tortoise', lowerId: 'cat', data: 'zz' };
        const rabbit = { id: 'rabbit', lowerId: 'dog', data: 'yy' };

        const items = [
            { id: 'dog', lowerId: undefined, data: 'ww' },
            { id: 'cat', lowerId: 'rabbit', data: 'xx' },
            tortoise,
            rabbit
        ];

        const whiteboard = new Whiteboard(items);

        whiteboard.extract([tortoise, rabbit]);

        expect(tortoise).toStrictEqual({ id: 'tortoise', lowerId: 'cat', data: 'zz' });
        expect(rabbit).toStrictEqual({ id: 'rabbit', lowerId: 'dog', data: 'yy' });
    });

    test("item id does not exist on whiteboard, throws exception", () => {
        const items = [
            { id: 'dog', lowerId: undefined, data: 'ww' },
            { id: 'cat', lowerId: 'rabbit', data: 'xx' },
            { id: 'rabbit', lowerId: 'dog', data: 'yy' },
            { id: 'tortoise', lowerId: 'cat', data: 'zz' }
        ];

        const whiteboard = new Whiteboard(items);

        expect(() => { 
            whiteboard.extract([
                { id: 'tortoise', lowerId: 'cat', data: 'zz' },
                { id: 'aaa', lowerId: 'dog', data: 'yy' }
            ])
        }).toThrow();
    });
});
