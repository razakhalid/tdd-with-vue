import SignupPage from "../../src/views/SignupPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
// import axios from 'axios';
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe('Sign Up Page', () => {
   describe('Layout', () => {
      it("has a header that says 'Sign Up'", () => {
         render(SignupPage);
         const header = screen.queryByRole("heading", { name: "Sign Up"});
         expect(header).not.toBeNull();
      });
      it("has a username input", () => {
         render(SignupPage);
         const input = screen.queryByLabelText("Username");
         expect(input).toBeInTheDocument();
      });
      it("has a email input", () => {
         render(SignupPage);
         const input = screen.queryByLabelText("E-mail");
         expect(input).toBeInTheDocument();
      });
      it("has a password input", () => {
         render(SignupPage);
         const input = screen.queryByLabelText("Password");
         expect(input).toBeInTheDocument();
      });
      it("has password type for password input", () => {
         render(SignupPage);
         const input = screen.queryByLabelText("Password");
         expect(input.type).toBe("password");
      });
      it("has a password repeat input", () => {
         render(SignupPage);
         const input = screen.queryByLabelText("Password Repeat");
         expect(input).toBeInTheDocument();
      });
      it("has password type for password repeat input", () => {
         render(SignupPage);
         const input = screen.queryByLabelText("Password Repeat");
         expect(input.type).toBe("password");
      });
      it("has a button that says 'Sign Up'", () => {
         render(SignupPage);
         const button = screen.queryByRole("button", { name: "Sign Up"});
         expect(button).toBeInTheDocument();
      });
      it("button is initially disabled", () => {
         render(SignupPage);
         const button = screen.queryByRole("button", { name: "Sign Up"});
         expect(button).toBeDisabled();
      });

   });
   describe('Interactions', () => {

      const setup = async function () {
         render(SignupPage);
         const usernameInput = screen.queryByLabelText("Username");
         const emailInput = screen.queryByLabelText("E-mail");
         const passwordInput = screen.queryByLabelText("Password");
         const passwordRepeatInput = screen.queryByLabelText("Password Repeat");

         await userEvent.type(usernameInput, "raza");
         await userEvent.type(emailInput, "raza@gmail.com");
         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4ssword");
      }

      it('enables the button when requirements are met', async () => {
         render(SignupPage);
         const passwordInput = screen.queryByLabelText("Password");
         const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
         const button = screen.queryByRole("button", { name: "Sign Up"});

         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4ssword");
         expect(button).toBeEnabled();
      });
      it( 'sends username, email and password to backend on btn click', async () => {

         // setup server
         let reqBody;
         const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
               reqBody = req.body;
               return res(ctx.status(200));
            })
         );
         server.listen();


         await setup();
         const button = screen.queryByRole("button", { name: "Sign Up"});

         // const mockFn = jest.fn();
         // axios.post = mockFn;
         // window.fetch = mockFn;

         await userEvent.click(button);

         await server.close();

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

         // setup server
         let clickCounter = 0;
         const server = setupServer(
             rest.post("/api/1.0/users", (req, res, ctx) => {
                clickCounter += 1;
                return res(ctx.status(200));
             })
         );
         server.listen();

         await setup();

         const button = screen.queryByRole("button", { name: "Sign Up"});

         await userEvent.click(button);
         await userEvent.click(button);

         await server.close();

         expect(clickCounter).toBe(1);
      });
      it(  'hides spinner when no api call', async () => {

         await setup();
         const spinner = screen.queryByRole("status");
         expect(spinner).not.toBeInTheDocument();


      });
      it(  'displays account activation info after signup', async () => {

         // setup server
         const server = setupServer(
             rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(200));
             })
         );
         server.listen();

         await setup();

         const button = screen.queryByRole("button", { name: "Sign Up"});

         await userEvent.click(button);
         await server.close();

         const text = await screen.findByText("Please check your email to activate your account");
         expect(text).toBeVisible();
      });
      it(  'hides account activation info before signup', async () => {
         await setup();

         const text = screen.queryByText("Please check your email to activate your account");
         expect(text).not.toBeVisible();
      });
      it(  'hides account activation info after failing signup', async () => {
         // setup server
         const server = setupServer(
             rest.post("/api/1.0/users", (req, res, ctx) => {
                // return res(ctx.status(400));
             })
         );
         server.listen();

         await setup();

         const button = screen.queryByRole("button", { name: "Sign Up"});
         await userEvent.click(button);
         await server.close();

         const text = screen.queryByText("Please check your email to activate your account");

         expect(text).not.toBeVisible();
      });
      it(  'hides signup form after signup', async () => {
         // setup server
         const server = setupServer(
             rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(200));
             })
         );
         server.listen();

         await setup();

         const button = screen.queryByRole("button", { name: "Sign Up"});
         const form = screen.queryByTestId("signup-form");

         await userEvent.click(button);
         await server.close();

         await waitFor(() => {
            expect(form).not.toBeVisible();
         });
      });
   });
});