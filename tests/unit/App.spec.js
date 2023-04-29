import App from '../../src/App.vue';
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import i18n from "@/i18n/i18n";

const setup = function (path) {
    window.history.pushState({}, "", path);
    render(App, {
        global: {
            plugins: [i18n]
        }
    });
}

describe('Routing',  function () {
    it.each`
    path | pageTestId
    ${'/'} | ${'home-page'}
    ${'/signup'} | ${'signup-page'}
    ${'/login'} | ${'login-page'}
    ${'/user/1'} | ${'user-page'} 
    ${'/user/2'} | ${'user-page'} 
    `("displays $pageTestId when path is $path", function ({ path, pageTestId }) {
        setup(path);
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
    `("does not display $pageTestId when path is $path", function ({ path, pageTestId }) {
        setup(path)
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });

    it.each`
    target
    ${'Home'}
    ${'Sign Up'}
    `('has link to $target on NavBar', function ({ target }) {
         setup('/');
         const link = screen.queryByRole("link", { name: target });
         expect(link).toBeInTheDocument();
    });

    it.each`
    initialPath | clickingTo | visiblePage
    ${'/'} | ${'Sign Up'} | ${'signup-page'}
    ${'/signup'} | ${'Home'} | ${'home-page'}
    `('displays $visiblePage after clicking $clickingTo link', async function ({ initialPath, clickingTo, visiblePage }) {
       setup(initialPath);
       const link = screen.queryByRole('link', { name: clickingTo });
        await userEvent.click(link);
        const page = screen.queryByTestId(visiblePage);
        expect(page).toBeInTheDocument();
    });
});