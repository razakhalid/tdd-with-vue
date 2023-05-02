import {setupServer} from "msw/node";
import {rest} from "msw";
import { render, screen } from '@testing-library/vue';
import userEvent from "@testing-library/user-event";
import UserList from "@/components/UserList.vue";

// setup server
const server = setupServer(
    rest.get("/api/1.0/users", (req, res, ctx) => {
        let page = Number.parseInt(req.url.searchParams.get('page'));
        let size = Number.parseInt(req.url.searchParams.get('size'));

        if (Number.isNaN(page)) {
            page = 0;
        }
        if (Number.isNaN(size)) {
            size = 5;
        }

        return res(ctx.status(200), ctx.json(getPage(page, size)));
    })
);

beforeAll(() => server.listen());
beforeEach(() => {
    server.resetHandlers();
})
afterAll(() => server.close());

const getPage = function (page, size) {
    const start = page * size;
    const end = start + size;
    const totalPages = Math.ceil(users.length / size);

    return {
        content: users.slice(start, end),
        page,
        size,
        totalPages: totalPages
    }
}

const users = [
    {
        "id":1,
        "username":"user1",
        "email":"user1@mail.com",
        "image":null
    },
    {
        "id":2,
        "username":"user2",
        "email":"user2@mail.com",
        "image":null
    },
    {
        "id":3,
        "username":"user3",
        "email":"user3@mail.com",
        "image":null
    },
    {"id":4,"username":"user4","email":"user4@mail.com","image":null},
    {"id":5,"username":"user5","email":"user5@mail.com","image":null},
    {"id":6,"username":"user6","email":"user6@mail.com","image":null},
    {"id":7,"username":"user7","email":"user7@mail.com","image":null}
];

describe('UserList', function () {
    it('should display 3 users in list', async function () {
       render(UserList);
       const users = await screen.findAllByText(/user/ );
       expect(users.length).toBe(3);
    });
    it('should display next page link', async function () {
        render(UserList);
        await screen.findByText('user1');
        const nextPageLink = screen.queryByText('next >');
        expect(nextPageLink).toBeInTheDocument();
    });
    it('should display next page after clicking next', async function () {
        render(UserList);
        await screen.findByText('user1');
        const nextPageLink = screen.queryByText('next >');
        await userEvent.click(nextPageLink);
        const firstUserOnPage2 = await screen.findByText('user4');
        expect(firstUserOnPage2).toBeInTheDocument();
    });
    it('should hide next page link on last page', async function () {
        render(UserList);
        await screen.findByText('user1');
        await userEvent.click(screen.queryByText('next >'));
        await screen.findByText('user4');
        await userEvent.click(screen.queryByText('next >'));
        await screen.findByText('user7')
        expect(screen.queryByText('next >')).not.toBeInTheDocument();
    });
    it('should hide previous page link on first page', async function () {
        render(UserList);
        await screen.findByText('user1');
        expect(screen.queryByText('< previous')).not.toBeInTheDocument();
    });
    it('should show previous page link on second page', async function () {
        render(UserList);
        await screen.findByText('user1');
        await userEvent.click(screen.queryByText('next >'));
        await screen.findByText('user4');
        expect(screen.queryByText('< previous')).toBeInTheDocument();
    });
    it('should display previous page after clicking previous link', async function () {
        render(UserList);
        await screen.findByText('user1');
        await userEvent.click(screen.queryByText('next >'));
        await screen.findByText('user4');
        await userEvent.click(screen.queryByText('< previous'));
        const firstUserOnPage0 = await screen.findByText('user1');
        expect(firstUserOnPage0).toBeInTheDocument();
    });
});