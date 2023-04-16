import SignupPage from "../../src/views/SignupPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
// import axios from 'axios';
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from '../../src/i18n/i18n';
const en = require('@/i18n/en.js');
const ol = require('@/i18n/ol.js');
import LanguageSelector from "@/components/LanguageSelector.vue";

// setup server
let reqBody;
let clickCounter = 0;
let acceptLanguageHeader;
const server = setupServer(
    rest.post("/api/1.0/users", (req, res, ctx) => {
       reqBody = req.body;
       clickCounter += 1;
       acceptLanguageHeader = req.headers.get("Accept-Language")
       return res(ctx.status(200));
    })
);

beforeAll(() => server.listen());
beforeEach(() => {
   clickCounter = 0;
   server.resetHandlers();
})
afterAll(() => server.close());

describe('Sign Up Page', () => {
   describe('Layout', () => {
      const setup = function () {
         render(SignupPage, {
            global: {
               plugins: [i18n]
            }
         });
      }

      it("has a header that says 'Sign Up'", () => {
         setup()
         const header = screen.queryByRole("heading", { name: "Sign Up"});
         expect(header).not.toBeNull();
      });
      it("has a username input", () => {
         setup()
         const input = screen.queryByLabelText("Username");
         expect(input).toBeInTheDocument();
      });
      it("has a email input", () => {
         setup()
         const input = screen.queryByLabelText("E-mail");
         expect(input).toBeInTheDocument();
      });
      it("has a password input", () => {
         setup()
         const input = screen.queryByLabelText("Password");
         expect(input).toBeInTheDocument();
      });
      it("has password type for password input", () => {
         setup()
         const input = screen.queryByLabelText("Password");
         expect(input.type).toBe("password");
      });
      it("has a password repeat input", () => {
         setup()
         const input = screen.queryByLabelText("Password Repeat");
         expect(input).toBeInTheDocument();
      });
      it("has password type for password repeat input", () => {
         setup()
         const input = screen.queryByLabelText("Password Repeat");
         expect(input.type).toBe("password");
      });
      it("has a button that says 'Sign Up'", () => {
         setup()
         const button = screen.queryByRole("button", { name: "Sign Up"});
         expect(button).toBeInTheDocument();
      });
      it("button is initially disabled", () => {
         setup()
         const button = screen.queryByRole("button", { name: "Sign Up"});
         expect(button).toBeDisabled();
      });

   });
   describe('Interactions', () => {

      let button, passwordInput, passwordRepeatInput, usernameInput;
      const setup = async function () {
         render(SignupPage, {
            global: {
               plugins: [i18n]
            }
         });
         usernameInput = screen.queryByLabelText("Username");
         const emailInput = screen.queryByLabelText("E-mail");
         passwordInput = screen.queryByLabelText("Password");
         passwordRepeatInput = screen.queryByLabelText("Password Repeat");
         button = screen.queryByRole("button", { name: "Sign Up"});
         await userEvent.type(usernameInput, "raza");
         await userEvent.type(emailInput, "raza@gmail.com");
         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4ssword");
      }

      const generateValidationError = function (field, msg) {
         return rest.post("/api/1.0/users", (req, res, ctx) => {
            return res(ctx.status(400), ctx.json({
               validationErrors: {
                  [field]: msg
               }
            }));
         })
      }

      it('enables the button when requirements are met', async () => {
         await setup();
         const passwordInput = screen.queryByLabelText("Password");
         const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4ssword");
         expect(button).toBeEnabled();
      });
      it( 'sends username, email and password to backend on btn click', async () => {

         await setup();


         // const mockFn = jest.fn();
         // axios.post = mockFn;
         // window.fetch = mockFn;

         await userEvent.click(button);
         await screen.findByText("Please check your email to activate your account");



         // const firstCall = mockFn.mock.calls[0];
         // const body = firstCall[1];
         // const body = JSON.parse(firstCall[1].body);

         expect(reqBody).toEqual({
            username: 'raza',
            email: 'raza@gmail.com',
            password: 'P4ssword'
         });
      });
      it(  'does not allow btn click when api call in progress', async () => {

         await setup();

         await userEvent.click(button);
         await userEvent.click(button);

         expect(clickCounter).toBe(1);
      });
      it(  'hides spinner when no api call', async () => {

         await setup();
         const spinner = screen.queryByRole("status");
         expect(spinner).not.toBeInTheDocument();
      });
      it(  'displays account activation info after signup', async () => {
         await setup();
         await userEvent.click(button);

         const text = await screen.findByText("Please check your email to activate your account");
         expect(text).toBeVisible();
      });
      it(  'hides account activation info before signup', async () => {
         await setup();

         const text = screen.queryByText("Please check your email to activate your account");
         expect(text).not.toBeVisible();
      });
      it(  'hides account activation info after failing signup', async () => {

         server.use(
             rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(400));
             })
         );

         await setup();
         await userEvent.click(button);

         const text = screen.queryByText("Please check your email to activate your account");
         expect(text).not.toBeVisible();
      });

      it.each`
      field | msg
      ${'username'} | ${'Username cannot be null'}
      ${'email'} | ${'Email cannot be null'}
      ${'password'} | ${'Password cannot be null'}
      `(  'displays $msg for $field field', async (options) => {

         const { msg, field } = options;

         server.use(generateValidationError(field, msg));

         await setup();
         await userEvent.click(button);

         const text = await screen.findByText(msg);
         expect(text).toBeInTheDocument();
      });
      it(  'hides spinner after error response received', async () => {

         server.use(
             rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(400), ctx.json({
                   validationErrors: {
                      username: 'Username cannot be null'
                   }
                }));
             })
         );

         await setup();
         await userEvent.click(button);

         await screen.findByText("Username cannot be null");
         const spinner = screen.queryByRole("status");
         expect(spinner).not.toBeInTheDocument();
      });
      it(  'enables button after error response received', async () => {

         server.use(generateValidationError("username", "Username cannot be null"));

         await setup();
         await userEvent.click(button);

         await screen.findByText("Username cannot be null");
         expect(button).toBeEnabled();
      });
      it('displays mismatch msg for password repeat', async function () {
         server.use(generateValidationError("passwordRepeat", "Password mismatch"));

         await setup();

         // override inputs
         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4sword");

         const text = await screen.findByText("Password must match");
         expect(text).toBeInTheDocument();
      });
      xit.each`
      field | msg                                  | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
      ${'email'} | ${'Email cannot be null'}       | ${'Email'}
      ${'password'} | ${'Password cannot be null'} | ${'Password'}
      `(  'clears validation error after $field field is updated', async ({ field, msg, label}) => {

         server.use(generateValidationError(field, msg));

         await setup();
         await userEvent.click(button);

         const text = await screen.findByText(msg);
         const input = screen.queryByLabelText(label);
         await userEvent.type(input, "updated");
         expect(text).not.toBeInTheDocument();
      });
      xit(  'hides signup form after signup', async () => {

         await setup();
         const form = screen.queryByTestId("signup-form");

         await userEvent.click(button);

         await waitFor(() => {
            expect(form).not.toBeInTheDocument();
         });
      });
   });
   describe('Internationalization', () => {
      let olBtn, enBtn, password, passwordRepeat, username, email, btn;
      const setup = function () {
         const app = {
            components: {
               SignupPage,
               LanguageSelector
            },
            template: `
               <div>
                  <SignupPage></SignupPage>
                  <LanguageSelector></LanguageSelector>
               </div>
            `
         }
         render(app, {
            global: {
               plugins: [i18n]
            }
         });
         olBtn = screen.queryByTitle("ol");
         enBtn = screen.queryByTitle("en");
         username = screen.queryByLabelText(en.username);
         email = screen.queryByLabelText(en.email);
         password = screen.queryByLabelText(en.password);
         passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
         btn = screen.queryByRole("button", { name: en.signup });
      }

      afterEach(function () {
         i18n.locale = 'en'
      });

      it('initially displays copy in english', async function () {
         setup();
         // screen.debug();
         expect(screen.queryByRole("heading", { name: en.signup })).toBeInTheDocument();
         expect(screen.queryByRole("button", { name: en.signup })).toBeInTheDocument();
         expect(screen.queryByLabelText(en.username),).toBeInTheDocument();
         expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
         expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
         expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
      });
      it('displays copy in ol after selecting it', async function () {
         setup();

         await userEvent.click(olBtn);

         expect(screen.queryByRole("heading", { name: ol.signup })).toBeInTheDocument();
         expect(screen.queryByRole("button", { name: ol.signup })).toBeInTheDocument();
         expect(screen.queryByLabelText(ol.username),).toBeInTheDocument();
         expect(screen.queryByLabelText(ol.email)).toBeInTheDocument();
         expect(screen.queryByLabelText(ol.password)).toBeInTheDocument();
         expect(screen.queryByLabelText(ol.passwordRepeat)).toBeInTheDocument();
      });
      it('displays copy in english after page is translated to ol', async function () {
         setup();

         await userEvent.click(olBtn);
         await userEvent.click(enBtn);

         expect(screen.queryByRole("heading", { name: en.signup })).toBeInTheDocument();
         expect(screen.queryByRole("button", { name: en.signup })).toBeInTheDocument();
         expect(screen.queryByLabelText(en.username),).toBeInTheDocument();
         expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
         expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
         expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
      });
      it('displays password mismatch validation in ol', async function () {
         setup();

         await userEvent.click(olBtn);

         password = screen.queryByLabelText(ol.password);
         passwordRepeat = screen.queryByLabelText(ol.passwordRepeat);

         await userEvent.type(password, "password");
         await userEvent.type(passwordRepeat, "pword");

         const validation = screen.queryByText(ol.passwordMismatch);

         expect(validation).toBeInTheDocument();
      });
      xit('sends accept-language en to server', async function () {
         setup();

         await userEvent.type(username, "user1");
         await userEvent.type(email, "password@gmail.com");
         await userEvent.type(password, "password");
         await userEvent.type(passwordRepeat, "password");
         await userEvent.click(btn);
         await screen.findByText("Please check your email to activate your account");

         expect(acceptLanguageHeader).toBe('en');
      });
   });
});