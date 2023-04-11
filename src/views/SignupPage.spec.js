const SignupPage = require('./SignupPage.vue');
const vtl = require('@testing-library/vue');
const { render, screen } = vtl;

it('has Sign Up header', () => {
    render(SignupPage);
    const header = screen.queryByRole('heading', { name: 'Sign Up' });
    expect(header).not.toBeNull();
});