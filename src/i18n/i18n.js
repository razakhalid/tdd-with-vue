import { createI18n } from "vue-i18n";

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {
            signup: "Sign Up",
            username: "Username",
            email: "Email",
            password: "Password",
            passwordRepeat: "Password Repeat",
            loading: "Loading..."
        },
        ol: {
            signup:"[ol] Sign Up",
            username:"[ol] Username",
            email:"[ol] Email",
            password:"[ol] Password",
            passwordRepeat:"[ol] Password Repeat",
            loading:"[ol] Loading..."
        }
    }
});

export default i18n;