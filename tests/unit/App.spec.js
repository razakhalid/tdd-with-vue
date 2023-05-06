import App from '../../src/App.vue';
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import i18n from "@/i18n/i18n";
import router from "@/router/index.js";
import store, { resetAuthState } from '../../src/store';
import { rest } from "msw";
import { setupServer } from "msw/node";


const server = setupServer(
    rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.get("/api/1.0/users", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                content: [
                    {
                        id: 1,
                        username: "user-in-list",
                        email: "user-in-list@mail.com",
                        image: null,
                    },
                ],
                page: 0,
                size: 0,
                totalPages: 0,
            })
        );
    }),
    rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        const id = Number.parseInt(req.params.id);
        return res(
            ctx.status(200),
            ctx.json({
                id,
                username: `user${id}`,
                email: `user${id}@mail.com`,
                image: null,
            })
        );
    }),
    rest.post("/api/1.0/auth", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: 5, username: "user5" }));
    })
);

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());


const setup = async function (path) {
    window.history.pushState({}, "", path);
    render(App, {
        global: {
            plugins: [i18n, router, store]
        }
    });
    router.replace(path)
    await router.isReady();
}

describe('Routing',  function () {
    it.each`
    path | pageTestId
    ${'/'} | ${'home-page'}
    ${'/signup'} | ${'signup-page'}
    ${'/login'} | ${'login-page'}
    ${'/user/1'} | ${'user-page'} 
    ${'/user/2'} | ${'user-page'} 
    ${'/activate/1234'} | ${'activation-page'} 
    ${'/activate/5678'} | ${'activation-page'} 
    `("displays $pageTestId when path is $path", async function ({ path, pageTestId }) {
        await setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
    path | pageTestId
    ${'/'} | ${'signup-page'}
    ${'/signup'} | ${'login-page'}
    ${'/signup'} | ${'user-page'}
    ${'/'} | ${'signup-page'}
    ${'/'} | ${'login-page'}
    ${'/'} | ${'user-page'}
    ${'/login'} | ${'signup-page'}
    ${'/login'} | ${'home-page'}
    ${'/login'} | ${'user-page'}
    ${'/login'} | ${'activation-page'}
    ${'/activate/123'} | ${'home-page'}
    ${'/activate/123'} | ${'login-page'}
    ${'/activate/123'} | ${'user-page'}
    ${'/user/1'} | ${'home-page'}
    `("does not display $pageTestId when path is $path", async function ({ path, pageTestId }) {
        await setup(path)
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });

    it.each`
    target
    ${'Home'}
    ${'Sign Up'}
    ${'Login'}
    `('has link to $target on NavBar', async function ({ target }) {
         await setup('/');
         const link = screen.queryByRole("link", { name: target });
         expect(link).toBeInTheDocument();
    });

    it.each`
    initialPath | clickingTo | visiblePage
    ${'/'} | ${'Sign Up'} | ${'signup-page'}
    ${'/signup'} | ${'Home'} | ${'home-page'}
    ${'/'} | ${'Login'} | ${'login-page'}
    `('displays $visiblePage after clicking $clickingTo link', async function ({ initialPath, clickingTo, visiblePage }) {
       await setup(initialPath);
       const link = screen.queryByRole('link', { name: clickingTo });
        await userEvent.click(link);
        const page = await screen.findByTestId(visiblePage);
        expect(page).toBeInTheDocument();
    });
});

describe('Login', function () {
    const setupLoggedIn = async function () {
        await setup('/login');
        await userEvent.type(screen.queryByLabelText("E-mail"), "user5@mail.com");
        await userEvent.type(screen.queryByLabelText("Password"), "P4ssword");
        await userEvent.click(screen.queryByRole("button", { name: "Login" }));
    }

    afterEach(() => {
       localStorage.clear();
       resetAuthState();
    });

    it('should display My Profile link in nav bar after successful login', async function () {
        await setupLoggedIn();
        await screen.findByTestId('home-page');
        const myProfileLink = screen.queryByRole('link', {
            name: 'My Profile'
        });
        expect(myProfileLink).toBeInTheDocument();
    });
    it('should display user page after clicking My Profile link', async function () {
        await setupLoggedIn();
        await screen.findByTestId('home-page');
        const myProfileLink = screen.queryByRole('link', {
            name: 'My Profile'
        });
        await userEvent.click(myProfileLink);
        await screen.findByTestId('user-page');
        const header = await screen.findByRole('heading', {
            name: 'User 5'
        });
        expect(header).toBeInTheDocument();
    });
    it('should store logged in state in local storage', async function () {
        await setupLoggedIn();
        await screen.findByTestId('home-page');
        const state = JSON.parse(localStorage.getItem('auth'));
        expect(state.isLoggedIn).toBeTruthy();
    });
});