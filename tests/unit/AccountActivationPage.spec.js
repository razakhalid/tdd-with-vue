import AccountActivationPage from "@/views/AccountActivationPage.vue";
import { render, screen } from '@testing-library/vue';
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "@/i18n/i18n";

// setup server
const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => {
    server.resetHandlers();
})
afterAll(() => server.close());

describe('Account Activation Page', function () {
    const setup = function (token) {
        render(AccountActivationPage, {
            global: {
                mocks: {
                    $route: {
                        params: {
                            token: token
                        }
                    }
                },
                plugins: [i18n]
            }
        });
    }

    let counter;
    beforeEach(() => {
        counter = 0;
        server.use(
            rest.post('/api/1.0/users/token/:token', function (req, res, ctx) {
                if (req.params.token === '5678') {
                    return res(ctx.status(400), ctx.json({
                        message: 'Activation failure'
                    }));
                }
                counter += 1;
                return res(ctx.status(200));
            })
        )
    })

    it('displays activation success msg when token is correct', async function () {
        setup('1234')
        const msg = await screen.findByText("Account is activated");
        expect(msg).toBeInTheDocument();
    });
    it('sends activation request to backend', async function () {
        setup('1234')
        await screen.findByText("Account is activated");
        expect(counter).toBe(1);
    });
    it('displays activation failure msg when token is incorrect', async function () {
        setup('5678')
        const msg = await screen.findByText("Activation failure");
        expect(msg).toBeInTheDocument();
    });
    it('displays spinner during activation api call', async function () {
        setup('1234')
        const spinner = await screen.findByRole('status');
        expect(spinner).toBeInTheDocument();
        await screen.findByText("Account is activated");
        expect(spinner).not.toBeInTheDocument();
    });
})
