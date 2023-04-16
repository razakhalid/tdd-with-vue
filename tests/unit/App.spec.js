import App from '../../src/App.vue';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/vue";
import i18n from "@/i18n/i18n";

describe('Routing',  function () {

    it.each`
    path | pageTestId
    ${'/'} | ${'home-page'}
    ${'/signup'} | ${'signup-page'}
    ${'/login'} | ${'login-page'}
    ${'/user/1'} | ${'user-page'} 
    ${'/user/2'} | ${'user-page'} 
    `("displays $pageTestId when path is $path", function ({ path, pageTestId }) {
        window.history.pushState({}, "", path);
        render(App, {
            global: {
                plugins: [i18n]
            }
        });
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
    path | pageTestId
    ${'/signup'} | ${'home-page'}
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
        window.history.pushState({}, "", path);
        render(App, {
            global: {
                plugins: [i18n]
            }
        });
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });
});