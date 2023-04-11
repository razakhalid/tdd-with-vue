import SignupPage from "../../src/views/SignupPage.vue";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from 'axios';

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
      it('enables the button when requirements are met', async () => {
         render(SignupPage);
         const passwordInput = screen.queryByLabelText("Password");
         const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
         const button = screen.queryByRole("button", { name: "Sign Up"});

         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4ssword");

         expect(button).toBeEnabled();
      });
      it('sends username, email and password to backend on btn click', async () => {
         render(SignupPage);
         const usernameInput = screen.queryByLabelText("Username");
         const emailInput = screen.queryByLabelText("E-mail");
         const passwordInput = screen.queryByLabelText("Password");
         const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
         const button = screen.queryByRole("button", { name: "Sign Up"});

         await userEvent.type(usernameInput, "raza");
         await userEvent.type(emailInput, "raza@gmail.com");
         await userEvent.type(passwordInput, "P4ssword");
         await userEvent.type(passwordRepeatInput, "P4ssword");
         await userEvent.click(button);

         const mockFn = jest.fn();

         expect(button).toBeEnabled();
      });
   });
});