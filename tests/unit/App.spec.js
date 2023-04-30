import App from '../../src/App.vue';
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import i18n from "@/i18n/i18n";
import router from "@/router/index.js";

const setup = async function (path) {
    window.history.pushState({}, "", path);
    render(App, {
        global: {
            plugins: [i18n, router]
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